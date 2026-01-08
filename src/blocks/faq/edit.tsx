/**
 * FAQ Block - Edit Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button, Placeholder } from '@wordpress/components';
import { plus, trash, dragHandle } from '@wordpress/icons';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * FAQ Item interface.
 */
interface FAQItem {
	id: string;
	question: string;
	answer: string;
}

/**
 * Block attributes interface.
 */
interface FAQAttributes {
	items: FAQItem[];
}

/**
 * Props for the SortableFAQItem component.
 */
interface SortableFAQItemProps {
	id: string;
	item: FAQItem;
	index: number;
	onChange: (index: number, item: FAQItem) => void;
	onRemove: (index: number) => void;
}

/**
 * Generate a unique ID for FAQ items.
 *
 * @return {string} Unique identifier.
 */
function generateId(): string {
	return crypto.randomUUID();
}

/**
 * Sortable FAQ Item Component.
 * @param root0
 * @param root0.id
 * @param root0.item
 * @param root0.index
 * @param root0.onChange
 * @param root0.onRemove
 */
function SortableFAQItem({ id, item, index, onChange, onRemove }: SortableFAQItemProps): JSX.Element {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 1000 : ('auto' as const)
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`wp-block-theme-oh-my-brand-faq__item ${isDragging ? 'is-dragging' : ''}`}
		>
			<div className="wp-block-theme-oh-my-brand-faq__item-header">
				<button
					className="wp-block-theme-oh-my-brand-faq__drag-handle"
					type="button"
					{...attributes}
					{...listeners}
					aria-label={__('Drag to reorder', 'theme-oh-my-brand')}
				>
					{dragHandle}
				</button>
				<span className="wp-block-theme-oh-my-brand-faq__item-number">{index + 1}</span>
				<Button
					icon={trash}
					label={__('Remove FAQ item', 'theme-oh-my-brand')}
					onClick={() => onRemove(index)}
					isDestructive
					size="small"
				/>
			</div>
			<div className="wp-block-theme-oh-my-brand-faq__item-content">
				<RichText
					tagName="div"
					className="wp-block-theme-oh-my-brand-faq__question"
					placeholder={__('Enter your question…', 'theme-oh-my-brand')}
					value={item.question}
					onChange={(question: string) => onChange(index, { ...item, question })}
					allowedFormats={['core/bold', 'core/italic']}
				/>
				<RichText
					tagName="div"
					className="wp-block-theme-oh-my-brand-faq__answer"
					placeholder={__('Enter your answer…', 'theme-oh-my-brand')}
					value={item.answer}
					onChange={(answer: string) => onChange(index, { ...item, answer })}
					allowedFormats={['core/bold', 'core/italic', 'core/link', 'core/strikethrough']}
				/>
			</div>
		</div>
	);
}

/**
 * Edit component for the FAQ block with drag-to-reorder support.
 * @param root0
 * @param root0.attributes
 * @param root0.setAttributes
 */
export default function Edit({ attributes, setAttributes }: BlockEditProps<FAQAttributes>): JSX.Element {
	const { items } = attributes;
	const blockProps = useBlockProps({
		className: 'wp-block-theme-oh-my-brand-faq'
	});

	// Ensure all items have IDs (migration from old format)
	const itemsWithIds: FAQItem[] = items.map((item) => ({
		...item,
		id: item.id || generateId()
	}));

	// Update items if any were missing IDs
	if (itemsWithIds.some((item, i) => item.id !== items[i]?.id)) {
		setAttributes({ items: itemsWithIds });
	}

	// Configure drag sensors
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8 // Prevents accidental drags
			}
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);

	/**
	 * Handle drag end - reorder items array.
	 * @param event
	 */
	const handleDragEnd = (event: DragEndEvent): void => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = itemsWithIds.findIndex((item) => item.id === active.id);
			const newIndex = itemsWithIds.findIndex((item) => item.id === over.id);

			setAttributes({
				items: arrayMove(itemsWithIds, oldIndex, newIndex)
			});
		}
	};

	/**
	 * Add a new FAQ item.
	 */
	const addItem = (): void => {
		setAttributes({
			items: [...itemsWithIds, { id: generateId(), question: '', answer: '' }]
		});
	};

	/**
	 * Update an FAQ item.
	 * @param index
	 * @param newItem
	 */
	const updateItem = (index: number, newItem: FAQItem): void => {
		const newItems = [...itemsWithIds];
		newItems[index] = newItem;
		setAttributes({ items: newItems });
	};

	/**
	 * Remove an FAQ item.
	 * @param index
	 */
	const removeItem = (index: number): void => {
		const newItems = itemsWithIds.filter((_, i) => i !== index);
		setAttributes({ items: newItems });
	};

	// Empty state
	if (itemsWithIds.length === 0) {
		return (
			<div {...blockProps}>
				<Placeholder
					icon="editor-help"
					label={__('FAQ Block', 'theme-oh-my-brand')}
					instructions={__('Add frequently asked questions to help your visitors.', 'theme-oh-my-brand')}
				>
					<Button variant="primary" onClick={addItem} icon={plus}>
						{__('Add First Question', 'theme-oh-my-brand')}
					</Button>
				</Placeholder>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={itemsWithIds.map((item) => item.id)} strategy={verticalListSortingStrategy}>
					<div className="wp-block-theme-oh-my-brand-faq__items">
						{itemsWithIds.map((item, index) => (
							<SortableFAQItem
								key={item.id}
								id={item.id}
								item={item}
								index={index}
								onChange={updateItem}
								onRemove={removeItem}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>

			<div className="wp-block-theme-oh-my-brand-faq__add">
				<Button variant="secondary" onClick={addItem} icon={plus}>
					{__('Add Question', 'theme-oh-my-brand')}
				</Button>
			</div>
		</div>
	);
}
