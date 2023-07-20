/* eslint-disable react/prop-types */
import "./loaderStyle.css";

function Loader({ options }) {
  const optionsLoadingId = {
    width: parseInt(options.width),
    height: parseInt(options.height),
  };

  const optionsLoading = {
    width: parseInt(options.width + 72),
    height: parseInt(options.height + 72),
  };

  return (
    <div>
      <div style={optionsLoading} className="loading">
        <div className="loading-id text-center">
          <div style={optionsLoadingId}></div>
        </div>
      </div>{" "}
    </div>
  );
}

export default Loader;
