const ko = {
  home: {
    title: "차곡차곡, {nickname}님의 {month}월 가계부",
    description: " 🔵 수입 ‣ {totalIncome}원\n\n 🔴 지출 ‣ {totalExpense}원",
    addButton: "내역 추가하기",
    emptyText: "이 날짜에는 내역이 없어요. 새로운 내역을 추가해보세요.",
  },
  profile: {
    title: "계정 관리",
    description: "내 정보를 수정할 수 있습니다.",
    updateProfile: {
      subTitle: "기본 정보",
      placeholder: {
        nickname: "닉네임",
      },
      button: {
        update: "프로필 변경하기",
      },
    },
    updatePassword: {
      subTitle: "비밀번호",
      placeholder: {
        oldPassword: "현재 비밀번호",
        newPassword: "새로운 비밀번호",
        confirmPassword: "새로운 비밀번호 확인",
      },
      button: {
        show: "펼치기",
        hide: "접기",
        update: "비밀번호 변경하기",
      },
      text: {
        error: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
      },
    },
    deleteAccount: {
      subTitle: "회원 탈퇴",
      placeholder: {
        email: "이메일",
        confirmationPhrase: "확인 문구",
      },
      button: {
        show: "펼치기",
        hide: "접기",
        delete: "탈퇴하기",
      },
      text: {
        warning:
          "⚠️ 경고: 모든 데이터가 영구적으로 삭제됩니다. 계정을 삭제하면 복구할 수 없습니다. 신중하게 결정해 주세요.",
        confirmPrompt: "정말로 진행하시겠습니까?",
      },
      label: {
        email: "이메일을 입력해주세요:",
        confirmationPhrase: '확인을 위해, 아래에 "{phrase}"를 입력해 주세요.:',
      },
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
  dialog: {},
};

export default ko;
