import { AppBar, Box, Link, Toolbar, Typography } from '@mui/material';
import { Plus } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';
import './topnavbar.scss';

function TopNavBar() {
  const nav = useLocation();
  const navigate=useNavigate();
  // identify the current route and display the appropriate button
  console.log(nav.pathname);
 
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color={"transparent"}>
        <Toolbar>
          <img src='assets/logo.svg' className='logo'  />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            
          </Typography>
          {nav.pathname === '/' &&
            <Link component="button" color="inherit" onClick={()=>navigate("/project")}><Plus />Create Project</Link>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopNavBar;
