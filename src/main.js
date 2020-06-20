import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

async function renameFiles(options) {
  console.log(options);
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
  await copyTemplateFiles(options).then(() => {
    renameFiles(options);
  });

  console.log("%s Files Ready", chalk.green.bold("DONE"));
  return true;
}
