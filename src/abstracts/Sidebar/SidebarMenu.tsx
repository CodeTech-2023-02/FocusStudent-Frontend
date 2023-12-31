import { useContext } from "react";

import { Box, Button, List, ListItem, alpha, styled } from "@mui/material";

import { Link as RouterLink, useLocation } from "react-router-dom";
import { Roles } from "../../constants/roles";
import {
  COURSE,
  DASHBOARD,
  POLICY,
  REPORT,
  SECTION,
  STUDENTS,
  TEACHERS,
} from "../../constants/routes";
import { SidebarContext } from "../../contexts/SidebarContext";
import { useAuth } from "../../state/AuthContext";

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(["color"])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  "transform",
                  "opacity",
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);
  const location = useLocation();
  const currentRoute = location.pathname;

  const auth = useAuth();
  const currentUserRole = auth?.currentUser?.role || "";

  const teacherAdminRoutes = [
    { path: DASHBOARD, label: "Dashboard" },
    { path: COURSE, label: "Cursos" },
    { path: STUDENTS, label: "Estudiantes" },
    { path: TEACHERS, label: "Profesores" },
    { path: REPORT, label: "Reportes" },
    { path: POLICY, label: "Políticas" },
  ];

  const adminRoutes = [{ path: SECTION, label: "Secciones" }];

  const studentRoutes = [
    { path: DASHBOARD, label: "Dashboard" },
    { path: COURSE, label: "Cursos" },
    { path: REPORT, label: "Reportes" },
    { path: POLICY, label: "Políticas" },
  ];

  let routes: any[] = [];
  if (currentUserRole.toUpperCase() === Roles.STUDENT) {
    routes = studentRoutes;
  } else if (currentUserRole.toUpperCase() === Roles.TEACHER) {
    routes = teacherAdminRoutes.filter((route) => route.path !== TEACHERS);
  } else if (currentUserRole.toUpperCase() === Roles.ADMIN) {
    routes = [
      teacherAdminRoutes[0],
      adminRoutes[0],
      teacherAdminRoutes[1],
      teacherAdminRoutes[2],
      teacherAdminRoutes[3],
      teacherAdminRoutes[4],
      teacherAdminRoutes[5],
    ];
  }

  return (
    <MenuWrapper>
      <List component="div">
        <SubMenuWrapper>
          <List component="div">
            {routes.map((route) => (
              <ListItem key={route.path} component="div">
                <RouterLink to={route.path}>
                  <Button
                    className={currentRoute === route.path ? "active" : ""}
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                  >
                    {route.label}
                  </Button>
                </RouterLink>
              </ListItem>
            ))}
          </List>
        </SubMenuWrapper>
      </List>
    </MenuWrapper>
  );
}

export default SidebarMenu;
