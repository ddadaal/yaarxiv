/* eslint-disable max-len */
export default {
  components: {
    fileUploader: {
      zoneLabel: "Drag and drop your file(s) here, or click to select the file(s).",
      "file-too-large" : "File is too large.",
      "file-too-small": "File is too small.",
      "too-many-files": "Too many files.",
      "file-invalid-type": "Invalid file type.",
    },
    tagInput: {
      placeholder: "Press Enter to add an item." ,
      commaToSplit: "Items can be separated by comma.",
    },
    requireAuth: {
      title: "Not Authorized",
      description: "You are not authorized to access this page. Please login as required user and try again.",
    },
    httpHandler: {
      tokenInvalid: "Your login session is expired or invalid. Please re-login.",
      serverError: "I am sorry that the request fails. Please retry or contact support.",
      networkError: "Network error. Please check your local network, or our network is down.",
    },
    errors: {
      notAuthorized: {
        title: "Not Authorized",
        description: "Login is required to access this page. Please login and retry.",
      },
      badRequest: {
        title: "Bad Request",
        description: "Your request is invalid. Please check your URL.",
      },
      forbidden: {
        title: "Forbidden",
        description: "You can't access this page. Please login as required user and retry.",
      },
      notFound: {
        title: "404",
        description: "The resource you are trying to access does not exist.",
      },
      serverError: {
        title: "Server Error",
        description: "We are sorry that our server just got a problem. Please continue when it is fixed.",
      },
      localNetworkError: {
        title: "Network Error",
        description: "Please check your local network, or our network is down.",
      },
    },
    form: {
      validationError: {
        email: "Please input a valid email.",
        invalid: "Invalid",
        required: "Required",
        codeLink: "Please input a valid code link or don't input anything",
      },
    },
    publicitySelect: {
      title: "Public",
      public: "Public",
      private: "Private",
    },
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
    admin: {
      articles: "Manage Articles",
      users: "Manage Users",
    },
  },
  login: {
    id: "Email",
    password: "Password",
    remember: "Remember",
    login: "Login",
    inProgress: "Logging In",
    register: "Register",
    invalid: "The email and password are invalid. Please check them and try again.",
    success: "Logged in successfully!",
    forget: "Forget Password",
    error: {
      invalid: "Your username and/or password is not valid.",
      emailSent: "The user is not validated. A validation email has been sent to your email.",
      emailNotSent: "The user is not validated. Check your email for validation email.",
    },
  },
  forgetPassword: {
    title: "Forget password",
    email: "Email",
    sendRecoveryMail: "Send Password Reset Mail",
    accountNotExist: "Account does not exist.",
    sent: {
      title: "Password reset mail has been sent!",
      description: "Please check your mail for further instructions.",
    },
    reset: {
      error: {
        title: "Password reset link is invalid",
        description: "Please request password reset again.",
      },
      title: "Reset password",
      password: "New Password",
      confirm: "Confirm New Password",
      notMatch: "New password do not match!",
      submit: "Submit",
      reset: "Clear",
      complete: {
        title: "Password has been reset successfully.",
        description: "Click {} to login.",
        loginLink: "here",
      },
    },
  },
  register: {
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    passwordNotMatch: "Passwords do not match",
    remember: "Remember",
    inProgress: "Registering",
    register: "Register",
    title: "Register",
    login: "Back to Login",
    conflict: "This email has been token by another account. Please change an email and try again.",
    success: {
      title: "Registration completed!",
      description: "An email has been sent to your mail. Please follow the instructions in the email to validate your account.",
    },
    emailValidation: {
      success: {
        title: "Your email has been Validated" ,
        description: "Click {} to login.",
        loginLink: "HERE",
      },
      failure: {
        title: "Email validation failed.",
        description: "Your link is invalid.",
      },
    },
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
    setup: {
      description: "Fill the email and password of an admin. The email and password can be used to login the system.",
      email: "Email",
      password: "Password",
      submit: "Submit",
      title: "Initialization",
      success: "System initialization successful.",
      conflict: "System has already initialized.",
    },
    upload: {
      pdf: {
        title: "1. Upload Script",
        description: "Please upload your script first. Max size: {} MB; Supported format: {}",
        existing: "Click {} to download current script",
        prompt: "Please select a file",
        here: "here",
      },
      info: {
        title: "2. Fill Article Information",
        prompt: "You must at least fill in title and keywords of one language. You must fill both title and keywords for one language.",
        articleTitleCn: "Chinese Title",
        keywordsCn: "Chinese Keywords",
        articleTitleEn: "English Title",
        keywordsEn: "English Keywords",
        fillOrDelete: "Fill this field, or delete {}",
        oneLanguageRequired: "At least title and keywords of one language are required.",
        authors:{
          field: "Authors (*: Corresponding Author)",
          required: "At last one author is required.",
          add: "Add",
          name: "Name",
          duplicated: "The author already exists.",
          affiliation: "Affiliation",
          correspondingAuthor: "Corresponding Author",
          confirm: "Confirm",
          cancel: "Cancel",
        },
        abstract: {
          title: "Abstract",
          length: "Length {} Max {}",
          write: "Write",
          preview: "Preview LaTeX",
          supportLatex: "Wrap LaTeX around a pair of $ symbols",
        },
        codeLink: "Link to Code (Optional. Link to repos from {} are accepted.)",
        doi: "DOI (Optional)",
        reset: "Reset",
        upload: "Upload",
        promise: "I promise: this article doesn't contain secret information, is an completely original work of authors. The authors are responsible for the article.",
        promiseRequired: "You must agree the promise.",
      },
      complete: {
        title: "Upload successful！",
        description: "The ID for your article is {}。\nYour article will be reviewed shortly. \nWhen the review is passed, your article will be available publicly in our platform.\n\nThanks for your support to the platform.",
      },
    },
    article: {
      revisions: "Revisions",
      retracted: "Retracted",
      download: "Download",
    },
    search: {
      year: "Submit Year",
      keywords: "Includes Keywords",
      authors: "Includes Authors",
      item: {
        id: "Article ID",
        retracted: "Retracted",
        createTime: "Create Time",
        lastUpdateTime: "Last Update Time",
        revisionCount: "Revision Count",
        codeLink: "Link to Code",
        doi: "DOI",
      },
      altTitle: {
        label: "{} Title",
      },
    },
    dashboard: {
      articles: {
        title: "Published Articles",
        articleId: "Article ID",
        articleTitle: "Article Title",
        createTime: "Create Time",
        lastUpdatedTime: "Last Updated Time",
        revisionCount: "Revision Count",
        actions: "Actions",
        ownerSetPublicity: "Publicity by Owner",
        adminSetPublicity: "Publicity by Admin",
        update: "Update",
        retracted: "Retracted",
        retract: {
          button: "Retract",
          title: "Confirm to retract the article?",
          content1: "Are you sure to retract the article {}?",
          content2: "The article will be marked as Retracted, and all files will be deleted.",
          confirm: "Confirm",
          cancel: "Cancel",
          success: "Article {} has been removed successfully!",
        },
      },
      profile: {
        title: "Profile",
        honor: "Honor",
        jobTitle: "Job Title",
        institution: "Institution",
        public: "Public",
        academicKeywords: "Academic Keywords",
        researchLabels: "Research Labels",
        confirm: "Change",
        confirming: "Changing...",
        reset: "Reset",
        success: "Profile updated successfully!",
      },
      accountInfo: {
        title: "Account Info",
        name: "Name",
        email: "Email",
        id: "Account ID",
        confirm: "Change",
        confirming: "Changing...",
        reset: "Reset",
        success: "Profile updated successfully!",
      },
      changePassword: {
        title: "Change Password",
        current: "Current password",
        changed: "New password",
        confirmChanged: "Confirm new password",
        changedNotMatch: "New passwords do not match!",
        confirm: "Change password",
        confirming: "Changing password...",
        reset: "Reset",
        wrongPassword: "Current password is not correct.",
        complete: "Password changed successfully!",
      },
    },
    updateArticle: {
      success: "Article updated successfully. New revision number: {}.",
      loading: "Loading current revision of article {}...",
      notAuthor: "You cannot update article {}.",
      retracted: "Article {} has been retracted. No more update is allowed.",
    },
    admin: {
      articles: {
        title: "Articles on the system",
        articleId: "Article ID",
        owner: "Owner",
        articleTitle: "Article Title",
        createTime: "Create Time",
        lastUpdatedTime: "Last Updated Time",
        revisionCount: "Revision Count",
        ownerSetPublicity: "Publicity by Owner",
        adminSetPublicity: "Publicity by Admin",
        actions: "Actions",
        delete: {
          button: "Delete",
          title: "Confirm to delete the article?",
          content: "Are you sure to delete the article {}? All your revisions will be removed.",
          confirm: "Confirm",
          cancel: "Cancel",
          success: "Article {} has been removed successfully!",
        },
      },
      users: {
        title: "Users on the system",
        userId: "User ID",
        name: "Name",
        email: "Email",
        role: {
          title: "Role",
          Admin: "Admin",
          User: "User",
        },
        articleCount: "Article Count",
        actions: "Actions",
        delete: {
          button: "Delete",
          title: "Confirm to delete user?",
          content: "Are you sure to delete the user {} (ID: {}) ? All related articles will be removed from system",
          confirm: "Confirm",
          cancel: "Cancel",
          success: "User {} (ID: {}) has been deleted successfully!",
        },
      },
    },
  },
};
