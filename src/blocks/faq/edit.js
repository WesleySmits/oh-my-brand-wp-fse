/**
 * FAQ Block - Edit Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button, Placeholder } from '@wordpress/components';
import { plus, trash } from '@wordpress/icons';

/**
 * FAQ Item Component
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.item     FAQ item data.
 * @param {number}   props.index    Item index.
 * @param {Function} props.onChange Handler for item changes.
 * @param {Function} props.onRemove Handler for item removal.
 * @return {Element} FAQ item element.
 */
function FAQItem( { item, index, onChange, onRemove } ) {
	return (
		<div className="wp-block-theme-oh-my-brand-faq__item">
			<div className="wp-block-theme-oh-my-brand-faq__item-header">
				<span className="wp-block-theme-oh-my-brand-faq__item-number">
					{ index + 1 }
				</span>
				<Button
					icon={ trash }
					label={ __( 'Remove FAQ item', 'theme-oh-my-brand' ) }
					onClick={ () => onRemove( index ) }
					isDestructive
					size="small"
				/>
			</div>
			<div className="wp-block-theme-oh-my-brand-faq__item-content">
				<RichText
					tagName="div"
					className="wp-block-theme-oh-my-brand-faq__question"
					placeholder={ __(
						'Enter your question…',
						'theme-oh-my-brand'
					) }
					value={ item.question }
					onChange={ ( question ) =>
						onChange( index, { ...item, question } )
					}
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
				<RichText
					tagName="div"
					className="wp-block-theme-oh-my-brand-faq__answer"
					placeholder={ __(
						'Enter your answer…',
						'theme-oh-my-brand'
					) }
					value={ item.answer }
					onChange={ ( answer ) =>
						onChange( index, { ...item, answer } )
					}
					allowedFormats={ [
						'core/bold',
						'core/italic',
						'core/link',
						'core/strikethrough',
					] }
				/>
			</div>
		</div>
	);
}

/**
 * Edit component for the FAQ block.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @return {Element} Editor element.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { items } = attributes;
	const blockProps = useBlockProps( {
		className: 'wp-block-theme-oh-my-brand-faq',
	} );

	/**
	 * Add a new FAQ item.
	 */
	const addItem = () => {
		setAttributes( {
			items: [ ...items, { question: '', answer: '' } ],
		} );
	};

	/**
	 * Update an FAQ item.
	 *
	 * @param {number} index   Item index.
	 * @param {Object} newItem Updated item data.
	 */
	const updateItem = ( index, newItem ) => {
		const newItems = [ ...items ];
		newItems[ index ] = newItem;
		setAttributes( { items: newItems } );
	};

	/**
	 * Remove an FAQ item.
	 *
	 * @param {number} index Item index to remove.
	 */
	const removeItem = ( index ) => {
		const newItems = items.filter( ( _, i ) => i !== index );
		setAttributes( { items: newItems } );
	};

	return (
		<div { ...blockProps }>
			{ items.length === 0 ? (
				<Placeholder
					icon="editor-help"
					label={ __( 'FAQ Block', 'theme-oh-my-brand' ) }
					instructions={ __(
						'Add frequently asked questions to help your visitors.',
						'theme-oh-my-brand'
					) }
				>
					<Button variant="primary" onClick={ addItem } icon={ plus }>
						{ __( 'Add First Question', 'theme-oh-my-brand' ) }
					</Button>
				</Placeholder>
			) : (
				<>
					<div className="wp-block-theme-oh-my-brand-faq__items">
						{ items.map( ( item, index ) => (
							<FAQItem
								key={ index }
								item={ item }
								index={ index }
								onChange={ updateItem }
								onRemove={ removeItem }
							/>
						) ) }
					</div>
					<div className="wp-block-theme-oh-my-brand-faq__add">
						<Button
							variant="secondary"
							onClick={ addItem }
							icon={ plus }
						>
							{ __( 'Add Question', 'theme-oh-my-brand' ) }
						</Button>
					</div>
				</>
			) }
		</div>
	);
}
