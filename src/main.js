import chalk from "chalk";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const templateNameReplace = "!!TemplateName!!";
const access = promisify(fs.access);

async function copyTemplateFiles(options) {
  //read all the files in the dir
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
          const result = data.replace(templateNameReplace, options.name);

          //check if dir exists if not create it
          if (!fs.existsSync(options.targetDirectory)) {
            fs.mkdirSync(options.targetDirectory);
          } else {
            return console.log(chalk.red.bold("ERROR"), "files already exists");
          }

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
        }
      );
    });
  });
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
