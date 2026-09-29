import errorIcon from "../assets/images/icon-error.svg";
import retryIcon from "../assets/images/icon-retry.svg";

// Full-page API error, shown instead of the search and the weather
export default function ErrorState({ onRetry }) {
    return (
        <section className="error-state" role="alert" aria-labelledby="error-title">
            <img className="error-icon" src={errorIcon} alt="" />
            <h1 className="error-title" id="error-title">
                Something went wrong
            </h1>
            <p>We couldn’t connect to the server (API error). Please try again in a few moments.</p>
            <button type="button" className="retry-button" onClick={onRetry}>
                <img src={retryIcon} alt="" />
                Retry
            </button>
        </section>
    );
}
