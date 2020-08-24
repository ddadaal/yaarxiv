/* eslint-disable max-len */
export default {
  id: "en",
  langStrings: ["en", "en-US"],
  detailedId: "en-US",
  name: "English",
  definitions: {
    components: {
      fileUploader: { zoneLabel: "Drag and drop your file(s) here, or click to select the file(s)." },
      tagInput: { placeholder: "Press Enter when completing input to add one item." },
    },
    header: {
      home: "Home",
      search: "Search",
      upload: "Upload",
      about: "About",
      login: "Login",
      welcome: "Welcome, {}",
      logout: "Logout",
      dashboard: "Dashboard",
    },
    login: {
      id: "Email",
      password: "Password",
      remember: "Remember",
      login: "Login",
      inProgress: "Logging In",
      register: "Register",
    },
    register: {
      email: "Email",
      password: "Password",
      remember: "Remember",
      inProgress: "Registering",
      register: "Register",
      title: "Register",
      login: "Back to Login",
    },
    footer: {
      main: {
        language: "Select language",
        help: {
          title: "Help",
          about: "About",
          law: "Law",
        },
        contact: {
          title: "Contacts",
          qq: "QQ",
          email: "Email",
          projectGithub: "Project GitHub Repo",
        },
      },
      copyright: "All rights are reserved.",
    },

    pages: {
      upload: {
        pdf: {
          title: "1. Upload PDF",
          description: "Please upload your PDF first. The system will automatically fill some of the information based on your PDF. You can always change the information manually.",
        },
        info: {
          title: "2. Fill Article Information",
          articleTitle: "Title",
          authors: "Authors",
          keywords: "Keywords",
          abstract: "Abstract",
          reset: "Reset",
          upload: "Upload",
        },
        complete: {
          title: "Upload successful！",
          description: "The ID for your article is {}。\nYour article will be reviewed shortly. \nWhen the review is passed, your article will be available publicly in our platform.\n\nThanks for your support to the platform.",
        },
      },
      article: {
        revisions: "Revisions",
        download: "Download",
      },
      search: {
        year: "Submit Year",
        keywords: "Includes Keywords",
        authors: "Includes Authors",
      },
    },
  },
};
