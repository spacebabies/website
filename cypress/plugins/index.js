/// <reference types="cypress" />

const { exec } = require("child_process");

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // generate the static html.
  on("before:run", (details) => {
    exec("npm run build", (error, stdout, stderr) => {
      console.log(stdout);
    });
  });

  // leave everything how we found it.
  on("after:run", (details) => {
    exec("npm run clean");
  });
};
