const ko = {
  home: {
    title: "Chagok, {nickname}'s Budget for {month}", // FIXME: 6으로 전달하면 June으로 표현하는 게 자연스러움
    description:
      " 🔵 Total Income ‣ ${totalIncome}\n\n 🔴 Total Expense ‣ ${totalExpense}",
    addButton: "Add a Transaction",
    emptyText: "Try to add a new transaction!",
  },
  profile: {
    title: "Edit Profile",
    description: "Edit your information.",
    updateProfile: {
      subTitle: "Profile",
      placeholder: {
        nickname: "Nickname",
      },
      button: {
        update: "Update profile",
      },
    },
    updatePassword: {
      subTitle: "Password",
      placeholder: {
        oldPassword: "Old password",
        newPassword: "New password",
        confirmPassword: "Confirm new password",
      },
      button: {
        show: "Show",
        hide: "Hide",
        update: "Update password",
      },
      text: {
        error: "The new password and confirmation password do not match.",
      },
    },
    deleteAccount: {
      subTitle: "Delete  Account",
      placeholder: {
        email: "Email",
        confirmationPhrase: "Confirmation phrase",
      },
      button: {
        show: "Show",
        hide: "Hide",
        delete: "Delete yout account",
      },
      text: {
        warning:
          "<span>⚠️ Warning: Deleting your account is permanent. </span>Once your account is deleted, all your data will be lost and cannot be recovered. Please make sure you want to proceed before taking this action.",
        confirmPrompt:
          "<span>Are you sure you want to delete your account?</span>",
      },
      label: {
        email: "Your email:",
        confirmationPhrase:
          'To verify, type <span><i>"{phrase}"</i><span> below:',
      },
      dialog: {},
    },
  },
  join: {
    title: "",
    description: "",
  },
  login: {
    title: "",
    description: "",
  },
  manageBudget: {
    title: "",
    description: "",
  },
  manageTransaction: {
    title: "",
    description: "",
  },
  stats: {
    title: "",
    description: "",
  },
  forbidden: {
    title: "",
    description: "",
  },
  notFound: {
    title: "",
    description: "",
  },
};

export default ko;
