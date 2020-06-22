import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
const replace = require("replace-in-file");

const templateNameReplace = "templatename";
const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory).then(() => {
    //change names
    console.log(options.targetDirectory);

    const replaceOptions = {
      files: [
        `${options.targetDirectory}**/*`,
        `${options.targetDirectory}**/**/*`,
      ],
      from: new RegExp(templateNameReplace, "g"),
      to: options.name,
    };

    //replace the templatename inside the files
    replace(replaceOptions)
      .then((results) => {
        //console.log("Replacement results:", results);

        results.forEach((result) => {
          const fileName = result.file.substring(
            result.file.lastIndexOf("/"),
            result.file.length
          );
          const folderName = result.file.substring(
            0,
            result.file.lastIndexOf("/")
          );

          if (fileName.includes(templateNameReplace)) {
            fs.rename(
              result.file,
              `${folderName}${fileName.replace(
                new RegExp(templateNameReplace, "g"),
                options.name
              )}`,
              (err) => {
                if (err) {
                  return console.log(chalk.red.bold("ERROR"), err);
                }
              }
            );
          }

          //replace the name of the file
          /**/
        });
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  });

  /*//read all the files in the dir
  fs.readdir(options.templateDirectory, (err, files) => {
    if (err) {
      return console.log(err, chalk.red.bold("ERROR"));
    }

    files.forEach((file) => {
      //read the file
      fs.readFile(
        `${options.templateDirectory}\\${file}`,
        "utf8",
        (err, data) => {
          if (err) {
            return console.log(err, chalk.red.bold("ERROR"));
          }

          //replace template text
          const result = data.replace(
            new RegExp(templateNameReplace, "g"),
            options.name
          );

          //check if dir exists if not create it
          if (!fs.existsSync(options.targetDirectory)) {
            fs.mkdirSync(options.targetDirectory);
          } else {
            return console.log(chalk.red.bold("ERROR"), "files already exists");
          }

          //update the content of the file
          fs.writeFile(
            `${options.targetDirectory}${file}`,
            result,
            "utf8",
            (err) => {
              if (err) {
                return console.log(err, chalk.red.bold("ERROR"));
              }
            }
          );

          //update the title of the sile itself
          fs.rename(
            `${options.targetDirectory}${file}`,
            `${options.targetDirectory}${file.replace(
              new RegExp(templateNameReplace, "g"),
              options.name
            )}`,
            (err) => {
              if (err) {
                return console.log(chalk.red.bold("ERROR"), err);
              }
            }
          );
        }
      );
    });
  });*/
}

export async function createFiles(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  //add directory path to targetDirectory
  options.targetDirectory += `\\${options.name}\\`;

  //set templateDirectory
  const templateDir = path.resolve(
    new URL(__filename).pathname,
    "../../templates",
    options.task.toLowerCase()
  );
  options.templateDirectory = templateDir;

  //try to access the template files
  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.log("%s Invalid task name", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  //move the files over
  console.log("creating files");
  await copyTemplateFiles(options);

  console.log("%s Files Ready", chalk.green.bold("DONE"));
  return true;
}
