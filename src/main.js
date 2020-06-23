import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
const replace = require("replace-in-file");
import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";

const templateNameReplace = "templatename";
const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory).then(() => {
    //change names
    console.log(options);

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
                  //return console.log(chalk.red.bold("ERROR"), err);
                }
              }
            );
          }
        });
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  });
}

async function initGit(options) {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory,
  });

  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize Git"));
  }

  return;
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

  //complete tasks
  const tasks = new Listr([
    {
      title: "Copy files",
      task: () => copyTemplateFiles(options),
    },
    {
      title: "initialize Git",
      task: () => initGit(options),
      enable: () => options.git,
      skip: () => !options.git,
    },
    {
      title: "Install dependecies",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () =>
        !options.runInstall
          ? "Pass --install to automaticly install"
          : undefined,
    },
  ]);

  //run tasks
  await tasks.run();

  console.log("%s Files Ready", chalk.green.bold("DONE"));
  return true;
}
