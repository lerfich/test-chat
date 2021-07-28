import classes from './Modal.module.css'
import PropTypes from 'prop-types';

import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom'

const Modal = ({
  visible = false,
  title = '',
  content = '',
  footer = '',
  onClose,
}: ModalProps) => {
  // создаем обработчик нажатия клавиши Esc
  const onKeydown = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'Escape':
        onClose()
        break
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
          <h3 className={classes.modalTitle}>{title}</h3>
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
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  footer: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default Modal;
