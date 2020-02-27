import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Link } from "react-router-dom";

interface MenuProps {
  value: any;
}

export default function SimpleMenu(props: MenuProps) {
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
        {props.value == 0 ? (
          <MenuItem onClick={handleClose}>
            <Link to="/indicators/new">Индикатор </Link>
          </MenuItem>
        ) : (
          <div>
            <MenuItem onClick={handleClose}>
              {" "}
              <Link to="/classifiers-entity/new">Классификатор сущности</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              {" "}
              <Link to="/classifiers-relation/new">Классификатор связи</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              {" "}
              <Link to="/classifiers-value/new">Классификатор значения</Link>
            </MenuItem>{" "}
          </div>
        )}
      </Menu>
    </div>
  );
}
