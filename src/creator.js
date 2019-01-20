var scopackager = require('simple-scorm-packager');
var fs = require('fs-extra');

const templateDir = "./src/template";

var cleanAndTrim = (text) => {
  var textClean = text.replace(/[^a-zA-Z\d\s]/g, "");
  return textClean.replace(/\s/g, "");
}

var creator = async (outputDir, h5pContentDir, tempDir) => {
  await fs.remove(tempDir);
  await fs.copy(templateDir, tempDir, { errorOnExist: false, overwrite: true, recursive: true });
  await fs.copy(h5pContentDir, tempDir + "/workspace", { errorOnExist: false, overwrite: true, recursive: true })

  return new Promise((resolve, reject) => {
    const options = {
      version: '2004 4th Edition',
      organization: 'Test Company',
      title: 'Test Course',
      language: 'en-EN',
      identifier: '00',
      masteryScore: 100,
      startingPage: 'index.html',
      source: tempDir,
      package: {
        version: "1.0.0",
        zip: true,
        outputFolder: outputDir,
        date: new Date().toISOString().slice(0, 10)
      }
    };
    scopackager(options, async () => {
      await fs.remove(tempDir);
      resolve(cleanAndTrim(options.title) +
        "_v" +
        options.package.version +
        "_" +
        options.package.date +
        ".zip");
    });
  });
};

exports.default = creator;