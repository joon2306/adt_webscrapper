const fs = require("fs");
const { parse } = require("csv-parse");
const Q = require("q");

const globalPath = "C:ADT_AUTO";

const readCsv = function (fileName) {
  const csvResults = [];
  const deferred = Q.defer();
  fs.createReadStream(`${globalPath}\\${fileName}.csv`)
    .pipe(parse({ delimiter: ",", fromLine: 2 }))
    .on("data", function (row) {
      if (row) {
        csvResults.push(row);
      }
    })
    .on("end", function () {
      deferred.resolve(csvResults);
    });

  return deferred.promise;
};

const getUsers = async function () {
  let users = await readCsv("users");
  users = formatUsers(users);
  return users;
};

const getApps = async function () {
  let apps = await readCsv("apps");
  apps = formatApps(apps);
  return apps;
};

const getEnvironments = async function () {
  let environments = await readCsv("environments");
  environments = formatEnvironments(environments);
  return environments;
};

const formatUsers = function (users) {
  users = users.map((user) => ({
    id: user[0],
    username: user[1],
    pwd: user[2],
    brand: user[3],
    role: user[4],
  }));
  return users;
};

const formatApps = function(apps) {
  apps = apps.map(app => ({
    name: app[0],
    username: app[1],
    pwd: app[2],
    icon: app[3]
  }));
  return apps;
}

const formatEnvironments = function(env) {
  env = env.map(el => el[0]);
  return env;
}

module.exports = { getUsers, getApps, getEnvironments };
