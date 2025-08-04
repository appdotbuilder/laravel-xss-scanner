<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWebsiteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:500',
            'description' => 'nullable|string|max:1000',
            'scan_settings' => 'nullable|array',
            'scan_settings.max_pages' => 'nullable|integer|min:1|max:1000',
            'scan_settings.max_depth' => 'nullable|integer|min:1|max:10',
            'scan_settings.delay_between_requests' => 'nullable|integer|min:0|max:10000',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Website name is required.',
            'url.required' => 'Website URL is required.',
            'url.url' => 'Please provide a valid URL (including http:// or https://).',
            'url.max' => 'URL cannot be longer than 500 characters.',
            'scan_settings.max_pages.max' => 'Maximum pages cannot exceed 1000 for performance reasons.',
            'scan_settings.max_depth.max' => 'Maximum depth cannot exceed 10 levels.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure URL has protocol
        if ($this->url && !str_starts_with($this->url, 'http://') && !str_starts_with($this->url, 'https://')) {
            $this->merge([
                'url' => 'https://' . $this->url
            ]);
        }
    }
}