import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="addButton">
      <Button
        startIcon={<AddCircleOutlineIcon />}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Добавить ▼
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Индикатор</MenuItem>
        <MenuItem onClick={handleClose}>Классификатор сущности</MenuItem>
        <MenuItem onClick={handleClose}>Классификатор связи</MenuItem>
        <MenuItem onClick={handleClose}>Классификатор значения</MenuItem>
      </Menu>
    </div>
  );
}
