/*
Copyright 2019 Javier Brea

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
const CliRunner = require("./CliRunner");

const LOG = "[CLI]: ";

module.exports = class InteractiveCliRunner {
  constructor(cliArguments, cliOptions, wait) {
    this._cli = new CliRunner(cliArguments, cliOptions);
    this._wait = wait;
  }

  _log(log) {
    console.log(`${LOG}${log}`);
  }

  async getCurrentScreen() {
    await this._wait(500);
    return this._cli.currentScreen;
  }

  async logCurrentScreen() {
    this._log(`Current screen:\n${await this.getCurrentScreen()}`);
    this._log("----------------");
  }

  async getCurrentSelection() {
    const screen = await this.getCurrentScreen();
    const splitted = screen.split("❯");
    const lastAction = splitted[splitted.length - 1];
    return lastAction.split("\n")[0];
  }

  async logCurrentSelection() {
    this._log(`Current selection: ❯ ${await this.getCurrentSelection()}`);
  }

  kill() {
    return this._cli.kill();
  }

  flush() {
    this._cli.flush();
  }

  get logs() {
    return this._cli.logs;
  }

  get currentScreen() {
    return this._cli.currentScreen;
  }

  async cursorDown(number) {
    this._log("Moving cursor down");
    this._cli.cursorDown();
    await this.logCurrentSelection();
    if (number > 1) {
      await this.cursorDown(number - 1);
    }
  }

  async pressEnter() {
    this._log("Pressing Enter");
    const newScreen = await this._cli.newScreenAfter(this._cli.pressEnter);
    await this.logCurrentSelection();
    return newScreen;
  }

  write(data) {
    this._log(`Writing: "${data}"`);
    this._cli.write(data);
  }
};
