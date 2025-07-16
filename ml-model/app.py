
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os, re, numpy as np, joblib
from sklearn.metrics.pairwise import cosine_similarity
import nltk
import spacy
from nltk.corpus import stopwords
from sentence_transformers import SentenceTransformer

# ──────────────────────────────
# 1. Load .env and Init Flask
# ──────────────────────────────
load_dotenv()
PORT = int(os.getenv("PORT", 5000))

app = Flask(__name__)
CORS(app)

# ──────────────────────────────
# 2. Ensure NLTK resources
# ──────────────────────────────
def ensure_nltk():
    for pkg in ("stopwords", "punkt"):
        try:
            nltk.data.find(f"corpora/{pkg}" if pkg == "stopwords"
                           else f"tokenizers/{pkg}")
        except LookupError:
            nltk.download(pkg, quiet=True)

ensure_nltk()
NLTK_STOP = set(stopwords.words("english"))

# ──────────────────────────────
# 3. Load spaCy
# ──────────────────────────────
try:
    nlp = spacy.load("en_core_web_sm", disable=["ner", "parser"])
except OSError:
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm", disable=["ner", "parser"])

RE_NONWORD = re.compile(r"\W+")
RE_DIGITS = re.compile(r"\d+")

def preprocess(text: str) -> str:
    text = RE_DIGITS.sub(" ", RE_NONWORD.sub(" ", text.lower()))
    doc = nlp(text)
    return " ".join(
        tok.lemma_ for tok in doc
        if len(tok) > 1 and tok.lemma_ not in NLTK_STOP
    )

# ──────────────────────────────
# 4. Load SBERT + Scalers (lazy)
# ──────────────────────────────
sbert_model = None
scaler_rj = None
scaler_rr = None

def load_models():
    global sbert_model, scaler_rj, scaler_rr
    if sbert_model is None:
        sbert_model = SentenceTransformer("miniLM_model")
    if scaler_rj is None:
        scaler_rj = joblib.load("scaler_rj.pkl")
    if scaler_rr is None:
        scaler_rr = joblib.load("scaler_rr.pkl")

# ──────────────────────────────
# 5. Prediction Endpoint
# ──────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    resume_text = data.get("resume_text", "").strip()
    job_desc = data.get("job_desc", "").strip()
    role_text = data.get("role", "").strip()

    if not all([resume_text, job_desc, role_text]):
        return jsonify({"error": "resume_text, job_desc, and role are required."}), 400

    # Load everything
    load_models()

    # Preprocess
    res_clean = preprocess(resume_text)
    jd_clean = preprocess(job_desc)
    role_clean = preprocess(role_text)

    # Encode
    res_vec, jd_vec, role_vec = sbert_model.encode(
        [res_clean, jd_clean, role_clean], convert_to_numpy=True
    )

    # Cosine similarity
    sim_rj = cosine_similarity([res_vec], [jd_vec])[0][0]
    sim_rr = cosine_similarity([res_vec], [role_vec])[0][0]

    # Apply scaling
    sim_rj_scaled = scaler_rj.transform([[sim_rj]])[0][0]
    sim_rr_scaled = scaler_rr.transform([[sim_rr]])[0][0]

    # Final ATS Score
    score = round((0.7 * sim_rj_scaled + 0.3 * sim_rr_scaled) * 100, 2)

    return jsonify({
        "score": float(score),
        "similarity_resume_jd": round(float(sim_rj), 4),
        "similarity_resume_role": round(float(sim_rr), 4),
        "suggestions": []  # Add enhancement logic if needed
    })

# ──────────────────────────────
# 6. Start Flask Server
# ──────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=False)


































































































# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from dotenv import load_dotenv
# import os, re, numpy as np
# from sklearn.metrics.pairwise import cosine_similarity

# # ─── NLP libs
# import nltk
# import spacy
# from nltk.corpus import stopwords

# # ───────────────────────────
# # 1. Environment / Flask init
# # ───────────────────────────
# load_dotenv()
# PORT = int(os.getenv("PORT", 5000))

# app = Flask(__name__)
# CORS(app)

# # ───────────────────────────
# # 2. Ensure NLTK resources
# # ───────────────────────────
# def ensure_nltk():
#     for pkg in ("stopwords", "punkt"):
#         try:
#             nltk.data.find(f"corpora/{pkg}" if pkg == "stopwords"
#                            else f"tokenizers/{pkg}")
#         except LookupError:
#             nltk.download(pkg, quiet=True)

# ensure_nltk()
# NLTK_STOP = set(stopwords.words("english"))

# # ───────────────────────────
# # 3. Load spaCy (tokeniser+lemmatiser)
# # ───────────────────────────
# try:
#     nlp = spacy.load("en_core_web_sm", disable=["ner", "parser"])
# except OSError:
#     from spacy.cli import download
#     download("en_core_web_sm")
#     nlp = spacy.load("en_core_web_sm", disable=["ner", "parser"])

# _RE_NONWORD = re.compile(r"\W+")
# _RE_DIGITS  = re.compile(r"\d+")

# def preprocess(text: str) -> str:
#     text = _RE_DIGITS.sub(" ", _RE_NONWORD.sub(" ", text.lower()))
#     doc  = nlp(text)
#     return " ".join(
#         tok.lemma_ for tok in doc
#         if len(tok) > 1 and tok.lemma_ not in NLTK_STOP
#     )

# # ───────────────────────────
# # 4. Lazy-loaded ML artefacts
# # ───────────────────────────
# sbert_model = None

# def load_models():
#     global sbert_model
#     if sbert_model is None:
#         from sentence_transformers import SentenceTransformer
#         sbert_model = SentenceTransformer("miniLM_model")

# # ───────────────────────────
# # 5. Prediction endpoint
# # ───────────────────────────
# @app.route("/predict", methods=["POST"])
# def predict():
#     data = request.get_json(force=True)
#     resume_text = data.get("resume_text", "").strip()
#     job_desc    = data.get("job_desc", "").strip()
#     role_text   = data.get("role", "").strip()

#     if not all([resume_text, job_desc, role_text]):
#         return jsonify({"error": "resume_text, job_desc, and role are required."}), 400

#     # Load model once
#     load_models()

#     # Preprocess
#     res_clean = preprocess(resume_text)
#     jd_clean  = preprocess(job_desc)
#     role_clean= preprocess(role_text)

#     # Embeddings
#     res_vec, jd_vec, role_vec = sbert_model.encode(
#         [res_clean, jd_clean, role_clean], convert_to_numpy=True
#     )

#     # Similarities
#     sim_rj = cosine_similarity([res_vec], [jd_vec ])[0][0]
#     sim_rr = cosine_similarity([res_vec], [role_vec])[0][0]

#     # Final ATS Score (raw)
#     score_raw = 0.7 * sim_rj + 0.3 * sim_rr
#     score = round(float(score_raw * 100), 2)

#     return jsonify({
#     "score": float(score),  # ensure native float
#     "similarity_resume_jd": round(float(sim_rj), 4),
#     "similarity_resume_role": round(float(sim_rr), 4),
#     "suggestions": []
# })

# # ───────────────────────────
# # 6. Run server
# # ───────────────────────────
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=PORT, debug=False)
