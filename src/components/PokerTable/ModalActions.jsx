import {Button, Icon, Modal} from 'semantic-ui-react';
import React from 'react';

const ModalActions = ({nextIssue, onClose, onNext}) => {
	return (
		<Modal.Actions id="modalControl">
			<Button.Group>
				<Button color="red" onClick={onClose}>
					<Icon name="close"/> Close
				</Button>
				<Button.Or/>
				<Button
					color="green"
					onClick={() => onNext(nextIssue)}
					disabled={!nextIssue}
				>
					<Icon name="chevron right"/> Next
				</Button>
			</Button.Group>
		</Modal.Actions>
	);
}

export default ModalActions;