import streamlit as st
import pandas as pd
import inspect
from collections import namedtuple
import pymorphy2
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Фикс для inspect.getargspec (для совместимости)
if not hasattr(inspect, 'getargspec'):
    ArgSpec = namedtuple('ArgSpec', 'args varargs keywords defaults')


    def getargspec(func):
        spec = inspect.getfullargspec(func)
        return ArgSpec(spec.args, spec.varargs, spec.varkw, spec.defaults)


    inspect.getargspec = getargspec

# Инициализация приложения
st.set_page_config(page_title="Импорт учебных планов с семантическим анализом", layout="wide")
st.title("📘 Импорт, нормализация и семантическое сопоставление учебных дисциплин")

# Инициализация морфологического анализатора
morph = pymorphy2.MorphAnalyzer()

# Список стоп-слов для исключения (включая "и")
STOP_WORDS = {'и', 'в', 'на', 'с', 'по', 'для', 'из', 'от', 'до', 'не', 'за', 'к', 'а', 'но', 'или'}

# Ожидаемые колонки и их синонимы
expected_columns = {
    "duration": ["длительность", "продолжительность", "duration"],
    "field_of_study": ["направление подготовки", "field of study", "специальность"],
    "language": ["язык обучения", "language"],
    "min_gpa_required": ["минимальный балл", "min gpa", "минимальный проходной балл"],
    "title": ["название", "дисциплина", "course title", "title"],
    "study_format": ["формат обучения", "study format", "форма обучения"],
    "university_id": ["id университета", "университет", "university id"],
    "competencies": ["компетенции", "результаты обучения", "competencies"],
    "description": ["аннотация", "описание", "description"]
}


def semantic_normalize(text):
    """Нормализация текста для семантического анализа с удалением стоп-слов"""
    if not isinstance(text, str):
        return ""

    words = text.split()
    lemmas = []
    for w in words:
        parsed = morph.parse(w)
        if parsed:
            lemma = parsed[0].normal_form
            if lemma not in STOP_WORDS:  # Исключаем стоп-слова
                lemmas.append(lemma)
    return ' '.join(lemmas)


def parse_file(uploaded_file):
    """Чтение загруженного файла"""
    if uploaded_file.name.endswith('.csv'):
        return pd.read_csv(uploaded_file)
    else:
        return pd.read_excel(uploaded_file)


def match_columns(df):
    """Автоматическое сопоставление колонок"""
    mapping = {}
    for key, variants in expected_columns.items():
        found = None
        for col in df.columns:
            col_lower = col.lower()
            if any(v.lower() in col_lower for v in variants):
                found = col
                break
        mapping[key] = found
    return mapping


def selectbox_with_other(label, options, current_val):
    """Выпадающий список с возможностью ввода своего значения"""
    opts = [None] + list(options) + ["Другое"]
    if current_val in opts:
        idx = opts.index(current_val)
    else:
        idx = 0
    choice = st.selectbox(label, opts, index=idx)
    if choice == "Другое":
        val = st.text_input(f"Введите своё значение для {label}:")
        return val.strip() if val.strip() else None
    else:
        return choice


# Загрузка эталонного файла
REFERENCE_FILE = "test_study_plans_100rows_semesters.xlsx"
try:
    df_reference = pd.read_excel(REFERENCE_FILE)
    column_map_ref = match_columns(df_reference)

    # Подготовка эталонных данных - теперь только по описанию
    df_reference['semantic_text'] = df_reference.apply(
        lambda row: semantic_normalize(row[column_map_ref.get('description')]
                                       if column_map_ref.get('description') in row
                                          and pd.notna(row[column_map_ref.get('description')])
                                       else ""),
        axis=1
    )

except Exception as e:
    st.error(f"Не удалось загрузить эталонный файл '{REFERENCE_FILE}': {e}")
    st.stop()


# Загрузка модели Sentence-BERT
@st.cache_resource
def load_model():
    return SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')


model = load_model()


# Вычисление эмбеддингов для эталонных данных
@st.cache_data(show_spinner=False)
def embed_texts(texts):
    return model.encode(texts, convert_to_numpy=True)


reference_embeddings = embed_texts(df_reference['semantic_text'].tolist())

# Интерфейс загрузки файла
uploaded_file = st.file_uploader("Загрузите файл с учебными курсами для анализа (.xlsx или .csv)", type=["xlsx", "csv"])

if uploaded_file:
    df = parse_file(uploaded_file)
    st.subheader("Предварительный просмотр загруженных данных")
    st.dataframe(df.head())

    column_map = match_columns(df)

    st.subheader("Проверьте и при необходимости исправьте соответствия полей")
    cols = st.columns(3)
    for i, key in enumerate(expected_columns):
        with cols[i % 3]:
            column_map[key] = selectbox_with_other(f"Поле для '{key}'", df.columns, column_map[key])

    if st.button("Подтвердить и провести семантическое сопоставление", type="primary"):
        data = []
        semantic_texts = []
        for _, row in df.iterrows():
            def get_val(k):
                val = column_map.get(k)
                if val is None:
                    return None
                if val in df.columns:
                    return row[val]
                else:
                    return val


            # Теперь используем только описание для семантического анализа
            desc = get_val("description") if get_val("description") else ""
            desc_norm = semantic_normalize(desc)
            semantic_texts.append(desc_norm)

            entry = {
                "title": get_val("title"),
                "field_of_study": get_val("field_of_study"),
                "description": desc,
                "normalized_description": desc_norm
            }
            data.append(entry)

        df_processed = pd.DataFrame(data)

        # Вывод нормализированных данных
        st.subheader("Нормализированные данные")
        st.dataframe(df_processed[['title', 'field_of_study', 'normalized_description']])

        st.success("Данные нормализованы. Выполняется семантический анализ...")

        # Эмбеддинги для загруженных данных
        query_embeddings = embed_texts(semantic_texts)

        # Косинусное сходство между загруженными курсами и эталонными
        similarities = cosine_similarity(query_embeddings, reference_embeddings)

        # Сбор результатов с фильтрацией по схожести >80%
        results = []
        for i, row in df_processed.iterrows():
            sims = similarities[i]
            top_idxs = sims.argsort()[-3:][::-1]  # индексы топ-3
            for rank, idx_ref in enumerate(top_idxs, 1):
                similarity_percent = round(sims[idx_ref] * 100, 2)
                if similarity_percent > 80:  # Фильтр по схожести >80%
                    results.append({
                        "Исходный курс": row['title'],
                        "Направление": row['field_of_study'],
                        "Эталонный курс": df_reference.iloc[idx_ref][column_map_ref.get('title')],
                        "Схожесть": f"{similarity_percent}%",
                        "Описание (исходное)": row['description'],
                        "Описание (эталон)": df_reference.iloc[idx_ref][column_map_ref.get('description')]
                    })

        # Вывод результатов
        st.subheader("Результаты семантического сопоставления (схожесть >80%)")
        if results:
            df_results = pd.DataFrame(results)
            st.dataframe(df_results.sort_values(['Исходный курс', 'Схожесть'], ascending=[True, False]))
        else:
            st.warning("Не найдено сопоставлений с схожестью более 80%")

        # Дополнительная визуализация
        if results:
            st.subheader("Статистика")
            st.write(f"Найдено {len(results)} значимых сопоставлений")

            # График распределения схожести
            similarity_values = [float(r['Схожесть'].replace('%', '')) for r in results]
            hist_values = pd.cut(similarity_values, bins=[80, 85, 90, 95, 100],
                                 labels=['80-85%', '85-90%', '90-95%', '95-100%'])
            st.bar_chart(hist_values.value_counts().sort_index())