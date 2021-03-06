import { jsx } from '@emotion/core'
import { RouteComponentProps, navigate, Link } from '@reach/router'
import { connect } from 'react-redux'
import { useEffect, useCallback, ChangeEvent } from 'react'

import { AppState, Merchant, Bid } from 'src/types'
import { containerStyles, headerStyles, contentStyles } from './MerchantView.styles'
import { editMerchant, fetchMerchants, deleteMerchant, fetchMerchant } from '../merchantList/MerchantListView.actions'
import { EditableField } from 'src/components/EditableField/EditableField'
import { BidsTable } from 'src/components/BidsTable/BidsTable'

type MerchantViewOwnProps = {}

type MerchantViewRouterProps = RouteComponentProps<{ merchantId: string }>

type MerchantViewStateProps = {
    merchant: Merchant
    isLoading: boolean
}

type MerchantViewDispatchProps = {
    fetchMerchant: (id: string) => void
    editMerchant: (id: string, merchant: Partial<Merchant>) => void
    deleteMerchant: (id: string) => void
}

type MerchantViewProps = MerchantViewOwnProps &
    MerchantViewRouterProps &
    MerchantViewStateProps &
    MerchantViewDispatchProps

export const MerchantViewComponent = ({
    merchant,
    merchantId,
    editMerchant,
    fetchMerchant,
    isLoading,
    deleteMerchant,
}: MerchantViewProps) => {
    useEffect(() => {
        fetchMerchant(merchantId)
    }, [merchantId])

    const handleEmailChange = useCallback(
        (email: string) => {
            editMerchant(merchant.id, {
                email,
            })
        },
        [merchant],
    )

    const handlePhoneChange = useCallback(
        (phone: string) => {
            editMerchant(merchant.id, {
                phone,
            })
        },
        [merchant],
    )

    const handleAvatarChange = useCallback(
        (avatarUrl: string) => {
            editMerchant(merchant.id, {
                avatarUrl,
            })
        },
        [merchant],
    )

    const handleNameChange = useCallback(
        (name: string) => {
            const [firstname, lastname] = name.split(' ')

            editMerchant(merchant.id, {
                firstname: firstname || '',
                lastname: lastname || '',
            })
        },
        [merchant],
    )

    const handlePremiumChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            editMerchant(merchant.id, {
                hasPremium: event.currentTarget.checked,
            })
        },
        [merchant],
    )

    const handleDeleteMerchant = useCallback(() => {
        deleteMerchant(merchant.id)

        navigate('/page/0')
    }, [merchant])

    const handleDeleteBid = useCallback(
        (bid: Bid) => {
            editMerchant(merchant.id, {
                bids: merchant.bids.filter(b => b.id !== bid.id),
            })
        },
        [merchant],
    )

    const handleAddBid = useCallback(
        (bid: Bid) => {
            editMerchant(merchant.id, {
                bids: [...merchant.bids, bid],
            })
        },
        [merchant],
    )

    if (!merchant) {
        return <div css={containerStyles}>Loading...</div>
    }

    return (
        <div css={containerStyles}>
            <Link to="/page/0">Home</Link>
            <div css={headerStyles}>
                <img src={merchant.avatarUrl} />
                <h3>
                    <EditableField
                        disabled={isLoading}
                        value={merchant.firstname + ' ' + merchant.lastname}
                        onChange={handleNameChange}
                    />
                </h3>
                <span />
                <p>{isLoading ? 'Loading... 💾' : ''}</p>
            </div>
            <div css={contentStyles}>
                <div>
                    email: <EditableField disabled={isLoading} value={merchant.email} onChange={handleEmailChange} />
                </div>

                <div>
                    phone: <EditableField disabled={isLoading} value={merchant.phone} onChange={handlePhoneChange} />
                </div>

                <div>
                    premium: <input type="checkbox" onChange={handlePremiumChange} checked={merchant.hasPremium} />
                </div>

                <div>
                    avatarUrl:{' '}
                    <EditableField disabled={isLoading} value={merchant.avatarUrl} onChange={handleAvatarChange} />
                </div>

                <div>
                    <BidsTable bids={merchant.bids} onAdd={handleAddBid} onRemove={handleDeleteBid} />
                </div>

                <div>
                    <button onClick={handleDeleteMerchant}>delete merchant</button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: AppState, ownProps: MerchantViewRouterProps) => ({
    merchant: state.merchantList.merchants.find(({ id }) => id === ownProps.merchantId),
    isLoading: state.merchantList.fetching.includes(ownProps.merchantId),
})

const mapDispatchToProps = {
    fetchMerchant,
    editMerchant,
    deleteMerchant,
}

export const MerchantView = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MerchantViewComponent)
