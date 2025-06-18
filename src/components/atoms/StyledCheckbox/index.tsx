import { useTheme } from "styled-components";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface Props {
  label: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent) => void;
}

const StyledCheckbox = ({ label, isChecked, onChange }: Props) => {
  const theme = useTheme();

  return (
    <FormControlLabel
      control={
        <Checkbox
          name="checkbox"
          checked={isChecked}
          onChange={onChange}
          sx={{
            "&.Mui-checked": {
              color: theme.button.primary, // 체크된 색상
            },
            marginLeft: "16px",
          }}
        />
      }
      label={label}
      sx={{
        color: isChecked ? theme.text.primary : theme.text.secondary,
        fontSize: "24px",
      }}
    />
  );
};

export default StyledCheckbox;
