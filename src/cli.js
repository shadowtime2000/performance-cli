const Benchmark = require("benchmark");
const ui = require("cliui")();

const { execSync } = require("child_process");

const benchmarkCommand = (commandList, async = true) => {
  const suite = new Benchmark.Suite();
  commandList.map((command) => {
    suite.add(command, () => {
      execSync(command);
    });
  });
  ui.div(
    {
      text: "Command",
      align: "left",
    },
    {
      text: "Cycles",
      align: "left",
    },
    {
      text: "hz",
      align: "left",
    },
    {
      text: "Time elapsed",
      align: "left",
    },
    {
      text: "Time per cycle",
      align: "left",
    }
  );
  console.log(ui.toString());
  suite.on("cycle", (e) => {
    /*console.log(
      `'${e.target.name}' - ${e.target.cycles} cycles - ${e.target.hz} hz - ${e.target.times.elapsed} time elapsed - ${e.target.times.cycle} time per cycle`
    );*/

    const tempUI = require("cliui")();

    tempUI.div(
      {
        text: e.target.name,
        align: "left",
      },
      {
        text: e.target.cycles,
        align: "left",
      },
      {
        text: e.target.hz,
        align: "left",
      },
      {
        text: e.target.times.elapsed,
        align: "left",
      },
      {
        text: e.target.times.cycle,
        align: "left",
      }
    );

    console.log(tempUI.toString());
  });
  suite.run({ async });
};

exports.cli = () => {
  require("yargs")
    .scriptName("performance-cli")
    .usage("Usage: $0 <cmd> [args]")
    .command(
      "run [command] [async]",
      true,
      (yargs) => {
        yargs.positional("async", {
          type: "boolean",
          default: true,
          describe: "Whether to run the performance tests async",
        });
        yargs.positional("command", {
          type: "string",
          default: "echo benchmark test",
          describe: "The command to test",
        });
      },
      (argv) => {
        benchmarkCommand([argv.command], argv.async);
      }
    )
    .help().argv;
};
