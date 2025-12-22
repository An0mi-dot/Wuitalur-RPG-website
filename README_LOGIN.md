# Configuração do Sistema de Login

O sistema de login foi implementado utilizando **Firebase** (Google). Como o site é hospedado no GitHub Pages (estático), precisamos de um serviço externo para gerenciar usuários e banco de dados.

## Passos para Configurar

1.  **Crie um projeto no Firebase:**
    *   Acesse [console.firebase.google.com](https://console.firebase.google.com/).
    *   Crie um novo projeto.

2.  **Ative a Autenticação:**
    *   No menu lateral, vá em **Criação** > **Authentication**.
    *   Clique em "Vamos começar".
    *   Na aba "Sign-in method", ative **E-mail/Senha**.

3.  **Crie o Banco de Dados (Firestore):**
    *   No menu lateral, vá em **Criação** > **Firestore Database**.
    *   Clique em "Criar banco de dados".
    *   Escolha o modo de produção ou teste (teste é mais fácil para começar, mas lembre-se de configurar as regras de segurança depois).
    *   **Regras de Segurança Sugeridas:**
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /users/{userId} {
              allow read, write: if request.auth != null && request.auth.uid == userId;
            }
          }
        }
        ```

4.  **Obtenha as Chaves de API:**
    *   Vá nas configurações do projeto (ícone de engrenagem > Configurações do projeto).
    *   Role até "Seus aplicativos" e clique no ícone de web `</>`.
    *   Registre o app (dê um apelido, ex: "Wuitalur Site").
    *   Copie o objeto `firebaseConfig`.

5.  **Atualize o Arquivo de Configuração:**
    *   Abra o arquivo `Pag_Principal/js/firebase-config.js`.
    *   Substitua os valores de exemplo pelas chaves que você copiou do Firebase.

## Funcionalidades Implementadas

*   **Login/Registro:** Página dedicada (`Pag_Principal/html/login.html`).
*   **Sessão:** O usuário permanece logado mesmo ao fechar o navegador.
*   **Perfil:**
    *   Alterar Nome de Usuário.
    *   Alterar Tema (Padrão, Vermelho, Azul).
    *   As preferências são salvas no Firestore e carregadas automaticamente.
*   **Integração:** O cabeçalho da página principal mostra o avatar e nome do usuário logado. Clicar nele abre o modal de personalização.

## Testando Localmente

Para testar o login localmente, você pode precisar rodar um servidor local simples (devido a políticas de segurança de cookies/auth em arquivos `file://`), mas o Firebase geralmente funciona bem mesmo assim. Se tiver problemas, use uma extensão como "Live Server" no VS Code.
