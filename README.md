# Personalized AI Companion Project

### Website: https://www.zampai.com/ 
![zampai1](https://github.com/RillVicosuh/zamp-ai/assets/65578557/52c18b0b-7a14-4883-a7a1-184da3bd1508)
![zampai2](https://github.com/RillVicosuh/zamp-ai/assets/65578557/ef25f615-42d1-401d-99ec-e521933cee81)
![zampai3](https://github.com/RillVicosuh/zamp-ai/assets/65578557/e8072960-7680-4986-91f1-e2dfdbacbad4)


## Overview

This project allows users to create and interact with personalized AI companions. Users can define the characteristics and conversation style of their AI companions, interact with them through a chat interface, and manage their data through a robust backend API.

## Features

- **Create AI Companion:** Users can define the name, description, image, and conversational seeds for their AI companions.
- **Interactive Chatting:** A real-time chat interface where users can converse with their AI companions.
- **Backend Management:** Server-side functions to handle creation, updating, and deletion of AI companions.

## Technologies

- **Frontend:** React, Next.js, and various UI components for form and chat functionalities.
- **Backend:** MySQL, Node.js with Express, Prisma for database operations, and Clerk for user authentication.
- **AI and Machine Learning:** Use of OpenAI API, LangChain, Replicate, and Pinecone vector database for generating AI-driven conversations based on user prompts.

## API Endpoints

### Create AI Companion

- **POST** `/api/character`: Create a new AI character.

### Update AI Companion

- **PATCH** `/api/character/{characterId}`: Update an existing AI character.

### Delete AI Companion

- **DELETE** `/api/character/{characterId}`: Delete an existing AI character.

### Chat with AI Companion

- **POST** `/api/chat/{chatId}`: Send a message to the AI companion and receive a response.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
