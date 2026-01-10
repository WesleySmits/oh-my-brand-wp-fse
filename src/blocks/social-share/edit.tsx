/**
 * Social Share Block - Edit Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { dragHandle, Icon } from '@wordpress/icons';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Block attributes interface.
 */
interface SocialShareAttributes {
	platforms: string[];
	displayStyle: 'icon' | 'icon-label' | 'label';
	layout: 'horizontal' | 'vertical';
	size: 'small' | 'medium' | 'large';
	useNativeShare: boolean;
	showLabel: boolean;
	labelText: string;
	openInPopup: boolean;
	alignment: 'left' | 'center' | 'right';
}

/**
 * Platform definition interface.
 */
interface Platform {
	slug: string;
	name: string;
}

/**
 * Available social platforms.
 */
const AVAILABLE_PLATFORMS: Platform[] = [
	{ slug: 'facebook', name: 'Facebook' },
	{ slug: 'x', name: 'X (Twitter)' },
	{ slug: 'linkedin', name: 'LinkedIn' },
	{ slug: 'pinterest', name: 'Pinterest' },
	{ slug: 'whatsapp', name: 'WhatsApp' },
	{ slug: 'email', name: 'Email' },
	{ slug: 'copy', name: 'Copy Link' },
];

/**
 * SVG Icons for platforms.
 */
const PLATFORM_ICONS: Record< string, JSX.Element > = {
	facebook: (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
		</svg>
	),
	x: (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	),
	linkedin: (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
		</svg>
	),
	pinterest: (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
		</svg>
	),
	whatsapp: (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
		</svg>
	),
	email: (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
			<path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
		</svg>
	),
	copy: (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path
				fillRule="evenodd"
				d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z"
				clipRule="evenodd"
			/>
		</svg>
	),
};

/**
 * Sortable platform item props.
 */
interface SortablePlatformItemProps {
	platform: Platform;
	isActive: boolean;
	onToggle: () => void;
}

/**
 * Sortable platform item component.
 * @param root0
 * @param root0.platform
 * @param root0.isActive
 * @param root0.onToggle
 */
function SortablePlatformItem( {
	platform,
	isActive,
	onToggle,
}: SortablePlatformItemProps ): JSX.Element {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable( {
		id: platform.slug,
		disabled: ! isActive,
	} );

	const style = {
		transform: CSS.Transform.toString( transform ),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={ setNodeRef }
			style={ style }
			className={ `social-share-platform-item ${
				isActive ? 'is-active' : ''
			}` }
		>
			<div
				className="social-share-platform-item__drag"
				{ ...attributes }
				{ ...listeners }
			>
				<Icon icon={ dragHandle } />
			</div>
			<ToggleControl
				__nextHasNoMarginBottom
				label={
					<span className="social-share-platform-item__label">
						<span className="social-share-platform-item__icon">
							{ PLATFORM_ICONS[ platform.slug ] }
						</span>
						{ platform.name }
					</span>
				}
				checked={ isActive }
				onChange={ onToggle }
			/>
		</div>
	);
}

/**
 * Social Share block edit component.
 * @param root0
 * @param root0.attributes
 * @param root0.setAttributes
 */
export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< SocialShareAttributes > ): JSX.Element {
	const {
		platforms,
		displayStyle,
		layout,
		size,
		useNativeShare,
		showLabel,
		labelText,
		openInPopup,
		alignment,
	} = attributes;

	const sensors = useSensors(
		useSensor( PointerSensor ),
		useSensor( KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		} )
	);

	const blockProps = useBlockProps( {
		className: `social-share social-share--layout-${ layout } social-share--style-${ displayStyle } social-share--size-${ size } social-share--align-${ alignment }`,
	} );

	/**
	 * Handle drag end for platform reordering.
	 * @param event
	 */
	const handleDragEnd = ( event: DragEndEvent ): void => {
		const { active, over } = event;

		if ( over && active.id !== over.id ) {
			const oldIndex = platforms.indexOf( active.id as string );
			const newIndex = platforms.indexOf( over.id as string );

			if ( oldIndex !== -1 && newIndex !== -1 ) {
				const newPlatforms = arrayMove( platforms, oldIndex, newIndex );
				setAttributes( { platforms: newPlatforms } );
			}
		}
	};

	/**
	 * Toggle platform on/off.
	 * @param slug
	 */
	const togglePlatform = ( slug: string ): void => {
		if ( platforms.includes( slug ) ) {
			setAttributes( {
				platforms: platforms.filter( ( p ) => p !== slug ),
			} );
		} else {
			setAttributes( { platforms: [ ...platforms, slug ] } );
		}
	};

	/**
	 * Get active platforms in order.
	 */
	const getActivePlatforms = (): Platform[] => {
		return platforms
			.map( ( slug ) =>
				AVAILABLE_PLATFORMS.find( ( p ) => p.slug === slug )
			)
			.filter( ( p ): p is Platform => p !== undefined );
	};

	/**
	 * Get inactive platforms.
	 */
	const getInactivePlatforms = (): Platform[] => {
		return AVAILABLE_PLATFORMS.filter(
			( p ) => ! platforms.includes( p.slug )
		);
	};

	return (
		<>
			<InspectorControls>
				{ /* Platforms Panel */ }
				<PanelBody
					title={ __( 'Platforms', 'theme-oh-my-brand' ) }
					initialOpen={ true }
				>
					<p
						className="components-base-control__help"
						style={ { marginTop: 0 } }
					>
						{ __(
							'Toggle platforms and drag to reorder active ones.',
							'theme-oh-my-brand'
						) }
					</p>

					{ /* Active platforms (sortable) */ }
					{ platforms.length > 0 && (
						<div className="social-share-platforms-active">
							<p className="social-share-platforms-heading">
								{ __( 'Active', 'theme-oh-my-brand' ) }
							</p>
							<DndContext
								sensors={ sensors }
								collisionDetection={ closestCenter }
								onDragEnd={ handleDragEnd }
							>
								<SortableContext
									items={ platforms }
									strategy={ verticalListSortingStrategy }
								>
									{ getActivePlatforms().map(
										( platform ) => (
											<SortablePlatformItem
												key={ platform.slug }
												platform={ platform }
												isActive={ true }
												onToggle={ () =>
													togglePlatform(
														platform.slug
													)
												}
											/>
										)
									) }
								</SortableContext>
							</DndContext>
						</div>
					) }

					{ /* Inactive platforms */ }
					{ getInactivePlatforms().length > 0 && (
						<div className="social-share-platforms-inactive">
							<p className="social-share-platforms-heading">
								{ __( 'Available', 'theme-oh-my-brand' ) }
							</p>
							{ getInactivePlatforms().map( ( platform ) => (
								<div
									key={ platform.slug }
									className="social-share-platform-item"
								>
									<div className="social-share-platform-item__drag social-share-platform-item__drag--disabled">
										<Icon icon={ dragHandle } />
									</div>
									<ToggleControl
										__nextHasNoMarginBottom
										label={
											<span className="social-share-platform-item__label">
												<span className="social-share-platform-item__icon">
													{
														PLATFORM_ICONS[
															platform.slug
														]
													}
												</span>
												{ platform.name }
											</span>
										}
										checked={ false }
										onChange={ () =>
											togglePlatform( platform.slug )
										}
									/>
								</div>
							) ) }
						</div>
					) }
				</PanelBody>

				{ /* Display Settings */ }
				<PanelBody
					title={ __( 'Display Settings', 'theme-oh-my-brand' ) }
				>
					<SelectControl
						__nextHasNoMarginBottom
						label={ __( 'Display Style', 'theme-oh-my-brand' ) }
						value={ displayStyle }
						options={ [
							{
								label: __( 'Icon Only', 'theme-oh-my-brand' ),
								value: 'icon',
							},
							{
								label: __(
									'Icon + Label',
									'theme-oh-my-brand'
								),
								value: 'icon-label',
							},
							{
								label: __( 'Label Only', 'theme-oh-my-brand' ),
								value: 'label',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( {
								displayStyle:
									value as SocialShareAttributes[ 'displayStyle' ],
							} )
						}
					/>
					<SelectControl
						__nextHasNoMarginBottom
						label={ __( 'Layout', 'theme-oh-my-brand' ) }
						value={ layout }
						options={ [
							{
								label: __( 'Horizontal', 'theme-oh-my-brand' ),
								value: 'horizontal',
							},
							{
								label: __( 'Vertical', 'theme-oh-my-brand' ),
								value: 'vertical',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( {
								layout: value as SocialShareAttributes[ 'layout' ],
							} )
						}
					/>
					<SelectControl
						__nextHasNoMarginBottom
						label={ __( 'Size', 'theme-oh-my-brand' ) }
						value={ size }
						options={ [
							{
								label: __( 'Small', 'theme-oh-my-brand' ),
								value: 'small',
							},
							{
								label: __( 'Medium', 'theme-oh-my-brand' ),
								value: 'medium',
							},
							{
								label: __( 'Large', 'theme-oh-my-brand' ),
								value: 'large',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( {
								size: value as SocialShareAttributes[ 'size' ],
							} )
						}
					/>
					<SelectControl
						__nextHasNoMarginBottom
						label={ __( 'Alignment', 'theme-oh-my-brand' ) }
						value={ alignment }
						options={ [
							{
								label: __( 'Left', 'theme-oh-my-brand' ),
								value: 'left',
							},
							{
								label: __( 'Center', 'theme-oh-my-brand' ),
								value: 'center',
							},
							{
								label: __( 'Right', 'theme-oh-my-brand' ),
								value: 'right',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( {
								alignment:
									value as SocialShareAttributes[ 'alignment' ],
							} )
						}
					/>
				</PanelBody>

				{ /* Label Settings */ }
				<PanelBody
					title={ __( 'Label', 'theme-oh-my-brand' ) }
					initialOpen={ false }
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Show Label', 'theme-oh-my-brand' ) }
						checked={ showLabel }
						onChange={ ( value ) =>
							setAttributes( { showLabel: value } )
						}
					/>
					{ showLabel && (
						<TextControl
							__nextHasNoMarginBottom
							label={ __( 'Label Text', 'theme-oh-my-brand' ) }
							value={ labelText }
							onChange={ ( value ) =>
								setAttributes( { labelText: value } )
							}
						/>
					) }
				</PanelBody>

				{ /* Behavior Settings */ }
				<PanelBody
					title={ __( 'Behavior', 'theme-oh-my-brand' ) }
					initialOpen={ false }
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __(
							'Use Native Share API',
							'theme-oh-my-brand'
						) }
						help={ __(
							'On supported devices, shows the native share dialog.',
							'theme-oh-my-brand'
						) }
						checked={ useNativeShare }
						onChange={ ( value ) =>
							setAttributes( { useNativeShare: value } )
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Open in Popup', 'theme-oh-my-brand' ) }
						help={ __(
							'Open share dialogs in a popup window instead of a new tab.',
							'theme-oh-my-brand'
						) }
						checked={ openInPopup }
						onChange={ ( value ) =>
							setAttributes( { openInPopup: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ showLabel && (
					<span className="social-share__label">{ labelText }</span>
				) }

				{ platforms.length === 0 ? (
					<p className="social-share__empty">
						{ __(
							'Select platforms in the block settings.',
							'theme-oh-my-brand'
						) }
					</p>
				) : (
					<ul className="social-share__list">
						{ getActivePlatforms().map( ( platform ) => (
							<li
								key={ platform.slug }
								className="social-share__item"
							>
								<button
									type="button"
									className={ `social-share__button social-share__button--${ platform.slug }` }
									aria-label={ platform.name }
								>
									{ displayStyle !== 'label' && (
										<span className="social-share__icon">
											{ PLATFORM_ICONS[ platform.slug ] }
										</span>
									) }
									{ displayStyle !== 'icon' && (
										<span className="social-share__text">
											{ platform.name }
										</span>
									) }
								</button>
							</li>
						) ) }
					</ul>
				) }
			</div>
		</>
	);
}
