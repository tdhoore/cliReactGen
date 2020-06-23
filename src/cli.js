import arg from "arg";
import inquirer from "inquirer";
import { createFiles } from "./main";

const tasks = ["create-project", "comp"];

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--install": Boolean,
      "--git": Boolean,
      "-i": "--install",
      "--g": "--git",
    },
    { argv: rawArgs.slice(2) }
  );

  return {
    task: args._[0],
    name: args._[1],
    runInstall: args["--install"] || false,
    git: args["--git"] || false,
  };
}

async function prompForMissingOptions(options) {
  const defaultTask = tasks[1];

  const questions = [];

  //check if a task is selected
  if (!options.task) {
    questions.push({
      type: "list",
      name: "task",
      message: "Please choose a task",
      choices: tasks,
      default: defaultTask,
    });

    //ask for a name
    questions.push({
      type: "input",
      name: "name",
      message: "Please give a name",
      default: "unTittled",
    });
  }

  //get answers from first questions
  const answers = await inquirer.prompt(questions);

  //get answers based on chosen tasks
  const specialQuestions = [];

  //check if task is create project and git is set
  if (answers.task === tasks[0] && !options.git) {
    specialQuestions.push({
      type: "confirm",
      name: "git",
      message: "Init git?",
      default: false,
    });
  }

  //check if task is create project and install is set
  if (answers.task === tasks[0] && !options.runInstall) {
    specialQuestions.push({
      type: "confirm",
      name: "runInstall",
      message: "Install dependecies",
      default: false,
    });
  }

  //ask the questions
  const specialAnswer = await inquirer.prompt(specialQuestions);

  return {
    ...options,
    task: options.task || answers.task,
    name: options.name || answers.name,
    git: options.git || specialAnswer.git,
    runInstall: options.runInstall || specialAnswer.runInstall,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);

  //give prompts if needed
  options = await prompForMissingOptions(options);

  await createFiles(options);
}
