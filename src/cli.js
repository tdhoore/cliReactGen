import arg from "arg";
import inquirer from "inquirer";

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
      message: "Please give a name for your comp",
      default: "unTittled",
    });
  }

  //check if task is create project and git is set
  if (options.task === tasks[0] && !options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Init git?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    task: options.task || answers.task,
    name: options.name || answers.name,
    git: options.git || answers.git,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);

  //give prompts if needed
  options = await prompForMissingOptions(options);

  console.log(options);
}
