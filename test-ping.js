const speedTest = require('speedtest-net');

(async () => {
  try {
    console.log(await speedTest());
  } catch (err) {
    console.log(err.message);
  } finally {
    process.exit(0);
  }
})();