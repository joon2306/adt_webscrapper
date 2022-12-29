const open = require("open");

const openChrome = async (url) => {
  await open(url, {
    app: {
      name: open.apps.chrome,
    },
  });
};

const openGoogle = async () => {
  await openChrome("https://google.com");
};

module.exports = { openGoogle };
