import CircularProgress from "@mui/material/CircularProgress";
import * as S from "./style";
import { useTheme } from "styled-components";

export default function LoadingScreen() {
  const theme = useTheme();

  return (
    <S.Wrapper>
      <CircularProgress
        size={50}
        thickness={4.0}
        sx={{ color: theme.button.primary }}
      />
    </S.Wrapper>
  );
}
