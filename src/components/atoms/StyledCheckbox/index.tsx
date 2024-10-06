import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface Props {
  label: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent) => void;
}

const StyledCheckbox = ({ label, isChecked, onChange }: Props) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name="checkbox"
          checked={isChecked}
          onChange={onChange}
          sx={{
            "&.Mui-checked": {
              color: "#0D99FF", // 체크된 색상
            },
            marginLeft: "16px",
          }}
        />
      }
      label={label}
      sx={{
        color: "#1E1E1E",
        fontSize: "24px",
      }}
    />
  );
};

export default StyledCheckbox;
