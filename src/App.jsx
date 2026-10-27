import { useRef, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Search,
  Volume2,
  Sparkles,
  ArrowUpRight,
  X,
} from "lucide-react";

const API_URL =
  "https://api.dictionaryapi.dev/api/v2/entries/en";

export default function App() {
  const [query, setQuery] = useState("");
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState([]);
const [photosLoading, setPhotosLoading] = useState(false);

  const inputRef = useRef(null);
async function loadPhotos(word) {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    setPhotos([]);
    setPhotosLoading(false);
    return;
  }

  setPhotosLoading(true);

  try {
    const response = await axios.get(
      "https://api.unsplash.com/search/photos",
      {
        params: {
          query: word,
          per_page: 6,
          orientation: "squarish",
        },
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    setPhotos(response.data.results || []);
  } catch (err) {
    setPhotos([]);
    console.error("Unable to load photos:", err);
  } finally {
    setPhotosLoading(false);
  }
}

  async function searchWord(event) {
    event.preventDefault();

    const word = query.trim();

    if (!word) {
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
setError("");
setEntry(null);
setPhotos([]);
setPhotosLoading(false);

    try {
      const response = await axios.get(
        `${API_URL}/${encodeURIComponent(word)}`
      );

      setEntry(response.data[0]);
loadPhotos(word);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(
          `We couldn't find "${word}". Check the spelling or try another word.`
        );
      } else {
        setError(
          "Unable to connect to the dictionary. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function clearSearch() {
    setQuery("");
    setEntry(null);
    setError("");
    inputRef.current?.focus();
  }

  function playPronunciation() {
    const audio = entry?.phonetics?.find(
      (item) => item.audio
    )?.audio;

    if (audio) {
      const audioUrl = audio.startsWith("//")
        ? `https:${audio}`
        : audio;

      new Audio(audioUrl).play().catch(() => {});
    }
  }

  const phonetic =
    entry?.phonetic ||
    entry?.phonetics?.find((item) => item.text)?.text;

  const hasAudio = entry?.phonetics?.some(
    (item) => item.audio
  );

  return (
    <main
      className={`page ${
        entry || error || loading ? "page--results" : ""
      }`}
    >
      {/* Brand header */}
      <header className="topbar">
        <a
          href="#"
          className="brand"
          onClick={(event) => {
            event.preventDefault();
            clearSearch();
          }}
        >
         

  
        </a>

        
      </header>

      {/* Main search area */}
      <section
        className={`search-panel ${
          entry || error || loading
            ? "search-panel--compact"
            : ""
        }`}
      >
        <div className="eyebrow">
          <Sparkles size={13} />
         
        </div>

        <h1>
          Discover the meaning
          <br className="desktop-break" /> of{" "}
          <span>any word.</span>
        </h1>

        <p className="intro">
          A world of words, all in one place.
        </p>

        <form
          className="search-form"
          onSubmit={searchWord}
        >
          <div className="input-wrap">
            <Search
              size={19}
              className="search-icon"
            />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search a word, e.g. sunset"
              aria-label="Search a word"
              autoComplete="off"
            />

            {query && (
              <button
                type="button"
                className="clear-button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="search-button"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
            <ArrowUpRight size={17} />
          </button>
        </form>

        <div className="search-hint">
          Try{" "}
          {["serendipity", "sunset", "sonder"].map(
            (word, index) => (
              <span key={word}>
                {index > 0 && ", "}
                <button
                  type="button"
                  onClick={() => {
                    setQuery(word);
                    inputRef.current?.focus();
                  }}
                >
                  {word}
                </button>
              </span>
            )
          )}
        </div>
      </section>

      {/* Results expand below the search area */}
      {(loading || error || entry) && (
        <section className="results" aria-live="polite">
          {loading && (
            <div className="state-card">
              <span className="spinner" />

              <div>
                <strong>Looking that up...</strong>
                <p>Finding the right words for you.</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="state-card">
              <div className="error-icon">?</div>

              <div>
                <strong>No definition found</strong>
                <p>{error}</p>

                <button
                  className="text-button"
                  onClick={() =>
                    inputRef.current?.focus()
                  }
                >
                  Try another word
                </button>
              </div>
            </div>
          )}

          {entry && !loading && (
            <>
              {/* Word information */}
              <article className="word-card">
                <div className="word-heading">
                  <div>
                    <div className="result-label">
                      DICTIONARY ENTRY
                    </div>

                    <h2>{entry.word}</h2>

                    {phonetic && (
                      <p className="phonetic">
                        {phonetic}
                      </p>
                    )}
                  </div>

                  {hasAudio && (
                    <button
                      className="audio-button"
                      onClick={playPronunciation}
                      aria-label="Play pronunciation"
                      title="Play pronunciation"
                    >
                      <Volume2 size={21} />
                    </button>
                  )}
                </div>

                <div className="word-divider" />

                <div className="quick-facts">
                  <div>
                    <span className="fact-label">
                      WORD
                    </span>
                    <strong>{entry.word}</strong>
                  </div>

                  <div>
                    <span className="fact-label">
                      MEANINGS
                    </span>
                    <strong>
                      {entry.meanings?.length || 0}{" "}
                      {entry.meanings?.length === 1
                        ? "entry"
                        : "entries"}
                    </strong>
                  </div>

                  {entry.origin && (
                    <div className="origin-fact">
                      <span className="fact-label">
                        WORD ORIGIN
                      </span>
                      <strong>{entry.origin}</strong>
                    </div>
                  )}
                </div>
              </article>

              {/* Definitions heading */}
              <div className="meaning-header">
                <div>
                  <div className="eyebrow">
                    THE DETAILS
                  </div>

                  <h3>Definitions &amp; meanings</h3>
                </div>

                <span className="meaning-count">
                  {entry.meanings?.length || 0} parts of
                  speech
                </span>
              </div>

              {/* One card for each part of speech */}
              <div className="meaning-list">
                {(entry.meanings || []).map(
                  (meaning, meaningIndex) => (
                    <article
                      className="meaning-card"
                      key={`${meaning.partOfSpeech}-${meaningIndex}`}
                    >
                      <div className="part-heading">
                        <span className="part-number">
                          {String(meaningIndex + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <h4>{meaning.partOfSpeech}</h4>
                      </div>

                      <ol className="definitions">
                        {(meaning.definitions || []).map(
                          (definition, index) => (
                            <li
                              key={`${index}-${definition.definition}`}
                            >
                              <p>
                                {definition.definition}
                              </p>

                              {definition.example && (
                                <blockquote>
                                  “{definition.example}”
                                </blockquote>
                              )}

                              {definition.synonyms?.length >
                                0 && (
                                <div className="word-tags">
                                  {definition.synonyms
                                    .slice(0, 5)
                                    .map((word) => (
                                      <button
                                        key={word}
                                        type="button"
                                        onClick={() =>
                                          setQuery(word)
                                        }
                                        title={`Search ${word}`}
                                      >
                                        {word}
                                      </button>
                                    ))}
                                </div>
                              )}
                            </li>
                          )
                        )}
                      </ol>

                      {/* Related words */}
                      {(meaning.synonyms?.length > 0 ||
                        meaning.antonyms?.length > 0) && (
                        <div className="related-words">
                          {meaning.synonyms?.length > 0 && (
                            <div>
                              <span>Synonyms</span>
                              <p>
                                {meaning.synonyms
                                  .slice(0, 8)
                                  .join(", ")}
                              </p>
                            </div>
                          )}

                          {meaning.antonyms?.length > 0 && (
                            <div>
                              <span>Antonyms</span>
                              <p>
                                {meaning.antonyms
                                  .slice(0, 8)
                                  .join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  )
                )}
              </div>

{/* Photo gallery */}
<section className="photo-section">
  <div className="photo-heading">
    <div>
      <div className="eyebrow">SEE THE WORD</div>
      <h3>Explore visually</h3>
      <p>Discover different sides of "{entry.word}".</p>
    </div>

    <span className="photo-count">
      {photos.length} photos
    </span>
  </div>

  {photosLoading ? (
    <div className="photo-loading">
      <span className="spinner" />
      <span>Finding beautiful images...</span>
    </div>
  ) : photos.length > 0 ? (
    <div className="photo-grid">
      {photos.map((photo) => (
        <a
          key={photo.id}
          className="photo-item"
          href={photo.links.html}
          target="_blank"
          rel="noreferrer"
          aria-label={`View photo by ${photo.user.name}`}
        >
          <img
            src={photo.urls.small}
            alt={
              photo.alt_description ||
              `Photo related to ${entry.word}`
            }
            loading="lazy"
          />

          <span className="photo-credit">
            {photo.user.name}
          </span>
        </a>
      ))}
    </div>
  ) : (
    <p className="photo-empty">
      No photos available right now.
    </p>
  )}

  <p className="photo-attribution">
    Photos provided by{" "}
    <a
      href="https://unsplash.com"
      target="_blank"
      rel="noreferrer"
    >
      Unsplash
    </a>
  </p>
</section>

              <p className="source-note">
                Definitions provided by the{" "}
                <a
                  href="https://dictionaryapi.dev/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Free Dictionary API
                </a>.
              </p>
            </>
          )}
        </section>
      )}

      {/* Welcome message before the first search */}
      {!entry && !error && !loading && (
        <section className="welcome-note">
          

          
        </section>
      )}

      <footer className="footer">
        <span>Made by Shannen </span>
        <span className="footer-divider">·</span>
      </footer>
    </main>
  );
}