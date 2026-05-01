import chalk from "chalk";

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  const time = chalk.white(`[${new Date().toISOString()}]`);
  const method =
    req.method === "GET"
      ? chalk.green(req.method)
      : req.method === "POST"
        ? chalk.yellow(req.method)
        : req.method === "PUT"
          ? chalk.blue(req.method)
          : req.method === "DELETE"
            ? chalk.red(req.method)
            : chalk.magenta(req.method);

  console.log(`${time} ${method} ${req.originalUrl}`);

  res.on("finish", () => {
    const duration = Date.now() - start;

    const statusColor =
      res.statusCode < 300
        ? chalk.green
        : res.statusCode < 400
          ? chalk.yellow
          : chalk.red;

    console.log(
      `${chalk.white(`[${new Date().toISOString()}]`)} ${method} ${
        req.originalUrl
      } - ${statusColor(res.statusCode)} - ${chalk.cyan(duration + "ms")}`,
    );
  });

  next();
};
