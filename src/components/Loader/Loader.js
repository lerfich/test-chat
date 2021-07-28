import classes from './Loader.module.css'
import PropTypes from 'prop-types';

function Loader({loading}) {
  return(
    (loading)
    ? (<div className={classes.ldsRoller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>)
    : (<div/>)
  )
}

Loader.propTypes = {
    loading: PropTypes.bool.isRequired,
}

export default Loader;
