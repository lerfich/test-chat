import classes from './Modal.module.css'
import PropTypes from 'prop-types';

import React from 'react'

const Modal = ({
  visible = false,
  content = {},
  footer = {},
  onClose,
}: ModalProps) => {
  // создаем обработчик нажатия клавиши Esc
  const onKeydown = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'Escape':
        onClose()
        break
      default: break;  
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  })

  //если компонент невидим, то не отображаем его
  if (!visible) return null

  //или возвращаем верстку модального окна
  return (
    <div className={classes.modal} onClick={onClose}>
      <div className={classes.modalDialog} onClick={e => e.stopPropagation()}>
        <div className={classes.modalHeader}>
          <span className={classes.modalClose} onClick={onClose}>
            &times;
          </span>
        </div>
        <div className={classes.modalBody}>
          <div className={classes.modalContent}>{content}</div>
        </div>
        {footer && <div className={classes.modalFooter}>{footer}</div>}
      </div>
    </div>
  )
}

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  content: PropTypes.object.isRequired,
  footer: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default Modal;
