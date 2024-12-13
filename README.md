# Hexabot Gemini Helper Extension

The **Hexabot Gemini Helper Extension** is a utility class designed to facilitate interaction with Google's Gemini AI API from other Hexabot extensions (such as plugins, channels, etc.). This helper allows developers to easily invoke the Gemini API and integrate advanced natural language understanding and response generation into Hexabot's chatbot builder.

[Hexabot](https://hexabot.ai/) is an open-source chatbot/agent solution that allows users to create and manage AI-powered, multi-channel, and multilingual chatbots with ease. If you would like to learn more, please visit the [official GitHub repo](https://github.com/Hexastack/Hexabot/).

## Features

- **API Integration**: Seamlessly connect to Google's Gemini AI API, enabling other extensions within Hexabot to access Gemini's capabilities.
- **Configurable Settings**: Configure parameters like model type, temperature, token count, penalties, and more for customized behavior.
- **Easy Integration**: Use as a helper utility to invoke the Gemini API from any other extension within Hexabot.
- **Flexible Options**: Supports various options such as response format, log probabilities and more to customize the behavior of Gemini.

## Prerequisites

Before setting up the Gemini Helper, you will need to generate an API token from Google’s Generative AI platform.

1. Go to the [Google Generative AI API page](https://ai.google.dev/gemini-api).
2. Select **"Develop in your own environment"** to generate your API token.
3. Once you have your API token, you can proceed to configure the plugin within Hexabot.

## Installation

To use the Gemini Helper Extension within Hexabot, follow these steps:

```
cd ~/projects/my-chatbot
npm install hexabot-helper-gemini
hexabot dev
```

Make sure you have the appropriate access credentials for the Gemini AI API.

## Usage

The Gemini Helper can be used to generate responses based on user input or integrate into more complex workflows involving conversation history and system prompts. Here's an overview of how to use this helper:

### Settings

The extension provides configurable settings that can be adjusted to suit your needs. Below are the available settings:

- **API Token**: API token required for authentication.
- **Model**: Specifies the model to use for generating responses (default: `gemini-1.5-flash`).
- **Temperature**: The temperature controls the degree of randomness in token selection. Lower temperatures are good for prompts that require a more deterministic response, while higher temperatures can lead to more diverse or creative results. A temperature of 0 is deterministic, meaning that the highest probability response is always selected (default: `0.8`).
- **Candidate Count**: Specifies the number of generated responses to return. Currently, this value can only be set to 1 (default: `1`).
- **Max Output Tokens**: Sets the maximum number of tokens to include in a candidate response (default: `1000`).
- **Top-K**: Changes how the model selects tokens for output. A topK of 1 means the selected token is the most probable among all the tokens in the model's vocabulary (greedy decoding), while a topK of 3 means that the next token is selected from among the 3 most probable using the temperature (default: `40`).
- **Top-P**: Changes how the model selects tokens for output. Tokens are selected from the most to least probable until the sum of their probabilities equals the topP value (default: `0.95`).
- **Presence Penalty**: Presence penalty applied to the next token's logprobs if the token has already been seen in the response (default: `0.0`).
- **Frequency Penalty**: Frequency penalty applied to the next token's logprobs, multiplied by the number of times each token has been seen in the response so far (default: `0.0`).
- **Response LogProbs**: If True, export the logprobs results in the response (default: `false`).

These settings can be customized using the Hexabot admin interface or programmatically via the Hexabot API.

### Example Integration

To use the Gemini Helper, simply inject the `GeminiLlmHelper` class and use it as shown below:

```typescript
const geminiHelper = this.helperService.use(
  HelperType.LLM,
  GeminiLlmHelper,
);
// ...
const text = await geminiHelper.generateChatCompletion(
  context.text,
  args.model,
  systemPrompt,
  history,
  {
    ...options,
    user: context.user.id,
  },
);
```

## Contributing

We welcome contributions from the community! Whether you want to report a bug, suggest new features, or submit a pull request, your input is valuable to us.

Please refer to our contribution policy first: [How to contribute to Hexabot](https://github.com/Hexastack/Hexabot/blob/main/CONTRIBUTING.md)

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://github.com/Hexastack/Hexabot/blob/main/CODE_OF_CONDUCT.md)

Feel free to join us on [Discord](https://discord.gg/rNb9t2MFkG)

## License

This software is licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:

1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).

---

_Happy Chatbot Building!_

