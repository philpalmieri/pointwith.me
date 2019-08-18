import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Item } from 'semantic-ui-react'

class SocialProfileList extends PureComponent {
  static propTypes = {
    auth: PropTypes.func.isRequired,
    providerData: PropTypes.arrayOf(PropTypes.object).isRequired,
    unlinkedProvider: PropTypes.func.isRequired
  };

  /**
   * Unlinks a provider from the current user account
   */
  handleProviderUnlink = async (e, provider) => {
    const { auth, unlinkedProvider } = this.props;

    if (window.confirm(`Do you really want to unlink ${provider}?`)) {
      const providers = await auth()
        .currentUser.unlink(`${provider}.com`)
        .catch(err => console.error(err));

      unlinkedProvider(provider, providers.providerData);
    }
  };

  renderProfileList = ({ providerId, photoURL }) => {
    const providerName = providerId.split('.')[0];

    return (
      <Item.Group key='providers'>
        <Item key={providerName}>
          <Item.Image
            src={photoURL}
            alt={providerName}
            size='tiny'
            circular
          />
          <Item.Content>
            <Item.Header as='h1'>{providerName}</Item.Header>
            <Item.Meta>
              <Button
                primary
                onClick={e => this.handleProviderUnlink(e, providerName)}
              >
                Unlink
              </Button>
            </Item.Meta>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  };

  render() {
    return (
      <Fragment>
        <p>
          <strong>Connected Social Accounts</strong>
        </p>
        <div>
          {this.props.providerData.map(this.renderProfileList)}
        </div>
      </Fragment>
    );
  }
}

export default SocialProfileList;
