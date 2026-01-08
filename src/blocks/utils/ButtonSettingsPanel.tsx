/**
 * Reusable Button Settings Panel Component
 *
 * Provides a consistent UI for configuring CTA buttons across blocks.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl, SelectControl } from '@wordpress/components';

/**
 * Button object interface.
 */
export interface BlockButton {
	text: string;
	url: string;
	openInNewTab: boolean;
}

/**
 * Variant type for button styles.
 */
type ButtonVariant = 'primary' | 'secondary';

/**
 * Props for ButtonSettingsPanel component.
 */
interface ButtonSettingsPanelProps {
	title: string;
	button: BlockButton;
	onChange: (button: BlockButton) => void;
	initialOpen?: boolean;
	showVariant?: boolean;
	variant?: ButtonVariant;
	onVariantChange?: (variant: ButtonVariant) => void;
}

/**
 * Reusable panel for button settings in block inspectors.
 *
 * @param props                 - Component props
 * @param props.title           - Panel title (e.g., "Primary Button")
 * @param props.button          - Current button values
 * @param props.onChange        - Callback when any button property changes
 * @param props.initialOpen     - Whether panel starts open
 * @param props.showVariant     - Whether to show variant selector
 * @param props.variant         - Current variant value
 * @param props.onVariantChange - Callback for variant changes
 */
export function ButtonSettingsPanel({
	title,
	button,
	onChange,
	initialOpen = false,
	showVariant = false,
	variant = 'primary',
	onVariantChange
}: ButtonSettingsPanelProps): JSX.Element {
	/**
	 * Update a single button property.
	 *
	 * @param key   - Property name to update
	 * @param value - New value
	 */
	const updateButton = (key: keyof BlockButton, value: string | boolean): void => {
		onChange({
			...button,
			[key]: value
		});
	};

	return (
		<PanelBody title={title} initialOpen={initialOpen}>
			<TextControl
				label={__('Button Text', 'theme-oh-my-brand')}
				value={button?.text || ''}
				onChange={(value: string) => updateButton('text', value)}
			/>
			<TextControl
				label={__('Button URL', 'theme-oh-my-brand')}
				value={button?.url || ''}
				onChange={(value: string) => updateButton('url', value)}
				type="url"
			/>
			<ToggleControl
				label={__('Open in new tab', 'theme-oh-my-brand')}
				checked={button?.openInNewTab || false}
				onChange={(value: boolean) => updateButton('openInNewTab', value)}
			/>
			{showVariant && onVariantChange && (
				<SelectControl<ButtonVariant>
					label={__('Button Style', 'theme-oh-my-brand')}
					value={variant}
					options={[
						{ label: __('Primary', 'theme-oh-my-brand'), value: 'primary' },
						{ label: __('Secondary', 'theme-oh-my-brand'), value: 'secondary' }
					]}
					onChange={(value) => onVariantChange(value)}
				/>
			)}
		</PanelBody>
	);
}

export default ButtonSettingsPanel;
