import React from "react";
import PropTypes from "prop-types";

const format = value => {
  return typeof value === "boolean" ? value.toString() : value;
};

const AboutView = ({ about }) => {
  return (
    <div className="content">
      <p className="content__title">About</p>
      <ul>
        {Object.keys(about).map(key => {
          return (
            <li key={key}>
              <b>{key}</b>: {format(about[key])}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

AboutView.propTypes = {
  about: PropTypes.object
};

export default AboutView;
