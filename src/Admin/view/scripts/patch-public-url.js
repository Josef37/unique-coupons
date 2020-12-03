const fs = require("fs");
const path = require("path");
const replaceStream = require("replacestream");

const publicUrlName = 'WP_COUPON_PUBLIC_URL';

const main = async () => {
  const directory = path.join(__dirname, "..", "build", "static", "js");
  const files = fs
    .readdirSync(directory)
    .filter(file => file.endsWith(".js"))
    .map(fileName => path.join(directory, fileName));

  for (const file of files) {
    const tmpFile = `${file}.tmp`;
    await new Promise((resolve, reject) => {
      const stream = fs
        .createReadStream(file)
        .pipe(
          replaceStream(
            '"__PUBLIC_URL_PLACEHOLDER__"',
            // the whitespace is added in order to prevent invalid code like `returnwindow.__PUBLIC_URL__`
            ` window.${publicUrlName} `
          )
        )
        .pipe(
          replaceStream(
            '"__PUBLIC_URL_PLACEHOLDER__/"',
            // the whitespace is added in order to prevent invalid code like `returnwindow.__PUBLIC_URL__+"/"`
            ` window.${publicUrlName}+"/"`
          )
        )
        .pipe(fs.createWriteStream(tmpFile));
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
    fs.unlinkSync(file);
    fs.copyFileSync(tmpFile, file);
    fs.unlinkSync(tmpFile);
  }
};

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
