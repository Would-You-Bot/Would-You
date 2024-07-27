<div align="center">

![Would You Banner](https://i.imgur.com/HSsvZMe.png)

[Website](https://wouldyoubot.com) • [Support](https://wouldyoubot.gg/discord) • [Invite](https://wouldyoubot.gg/invite) • [Vote](https://top.gg/bot/981649513427111957/vote) • [ToS](https://wouldyoubot.gg/terms) • [Privacy](https://wouldyoubot.gg/privacy)

---

Would You is a popular Discord bot that allows you to play the classic game of Would You Rather with your friends!

---

</div>

# Getting Started

## Starting the Development Environment

The development environment does not currently use Docker, so you will need to install the dependencies manually.

1. Install [Node.js](https://nodejs.org/en/) (version 17.9.x or higher) and pnpm.
2. Install all dependencies by running `pnpm install` in the root directory.
3. Create a `.env` file in the root directory, copy the contents of `.env.example` into `.env`, and then fill in the values with your values.
4. Run `pnpm run test` to start the development environment. This will run all of the applications in development mode.

### Formatting

Before committing, make sure to run `pnpm format` to format the code. This will also be run automatically when you commit, but it is better to run it manually to make sure you don't commit code that isn't formatted correctly.

Additionally, it is recommended to install the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension for VS Code. This will automatically format the code when you save (or based on the event you choose).

### Committing

Follow the Angular commit message format. See [here](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) for more information.

### NPM Scripts

You can run the below scripts with `pnpm <script>`.

| Script   | Description                      |
| -------- | -------------------------------- |
| `start`  | Runs the code in production mode |
| `dev`    | Runs the code in dev mode        |
| `format` | Formats the code.                |

### Discord logs

Logs are also sent to Discord to allow for easier and more accessible debugging, as not everyone will have access to the host system, especially in production. The channels for the different log levels are defined in the `.env` file.

# Docker deployment

For a guide regarding the deployment on our production server go to [this link](https://github.com/Would-You-Bot/config)

# Project Details

## Contributing

If you would like to contribute to the project, please read the [contributing guidelines](/CODE_OF_CONDUCT.md). If you have any questions, feel free to ask in the [support server](https://wouldyoubot.gg/discord).

## License

This project is licensed under the following [License](/LICENSE).
