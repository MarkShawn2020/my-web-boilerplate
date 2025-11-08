'use client';

import React, { useRef, useState} from 'react';
import {RegisterOptions, UseFormRegister, UseFormSetValue} from 'react-hook-form';
import {Input} from "@/components/ui/input";
import {cn} from '@/lib/utils';
import "./autofill.css"

export interface ProfessionalInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
    label: string;
    name: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
    register?: UseFormRegister<any>;
    rules?: RegisterOptions;
    setValue?: UseFormSetValue<any>;
}

export const ProfessionalInput = ({ ref, className, type = "text", label, name, error, leftIcon, rightIcon, isLoading = false, register, rules, setValue, onChange, onFocus, onBlur, value, ...props }: ProfessionalInputProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
        const [isFocused, setIsFocused] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);

        // 处理输入变化 - 支持自动填充检测
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            // 如果有setValue，手动更新form值（用于自动填充检测）
            if (setValue) {
                setValue(name, event.target.value);
            }
            
            // 调用外部传入的onChange
            if (onChange) {
                onChange(event);
            }
        };

        // 处理焦点事件
        const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            if (onFocus) {
                onFocus(event);
            }
        };

        const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            if (onBlur) {
                onBlur(event);
            }
        };

        // 获取register返回的props，并合并自定义的onChange
        const getInputProps = () => {
            if (register) {
                const registerProps = register(name, {
                    ...rules,
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                        // 首先调用原始的onChange处理
                        handleChange(event);
                        // 然后调用register原本的onChange（如果有的话）
                        if (rules?.onChange) {
                            rules.onChange(event);
                        }
                    }
                });
                
                return {
                    ...registerProps,
                    onFocus: handleFocus,
                    onBlur: handleBlur,
                };
            } else {
                return {
                    name,
                    onChange: handleChange,
                    onFocus: handleFocus,
                    onBlur: handleBlur,
                    value,
                };
            }
        };

        return (
            <div className="space-y-2">
                {/* 标签 - Lovpen 设计系统，放在上方 */}
                <label
                    htmlFor={name}
                    className="block text-sm font-medium transition-colors duration-200"
                    style={{
                        color: isFocused ? '#D97757' : '#87867F',
                        fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif',
                        lineHeight: '1.2'
                    }}
                >
                    {label}
                </label>

                <div className="relative">
                    {/* 左侧图标 - Lovpen 色彩 */}
                    {leftIcon && (
                        <div
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                            style={{color: '#87867F'}}>
                            {leftIcon}
                        </div>
                    )}

                    {/* 输入框 - Lovpen 设计系统 */}
                    <Input
                        id={name}
                        type={type}
                        className={cn(
                            "flex h-14 w-full rounded-xl border text-sm",
                            "transition-all duration-200",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            leftIcon ? "pl-14" : "pl-3",
                            rightIcon ? "pr-10" : "pr-3",
                            "py-4",
                            className
                        )}
                        style={{
                            backgroundColor: '#F0EEE6',
                            borderColor: error ? '#CC785C' : (isFocused ? '#D97757' : '#E8E6DC'),
                            color: '#181818',
                            fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif',
                            borderRadius: '0.75rem',
                            borderWidth: '1px',
                            lineHeight: '1.2',
                            ...(isFocused && {
                                boxShadow: '0 0 0 2px rgba(217, 119, 87, 0.2)',
                                outline: 'none'
                            })
                        }}
                        ref={inputRef}
                        {...props}
                        {...getInputProps()}
                    />

                    {/* 右侧图标或加载状态 - Lovpen 色彩 */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                                 style={{borderColor: '#D97757', borderTopColor: 'transparent'}}></div>
                        ) : (
                            rightIcon && <div style={{color: '#87867F'}}>{rightIcon}</div>
                        )}
                    </div>

                    {/* 聚焦时的光晕效果 - Lovpen 主色 */}
                    {isFocused && (
                        <div className="absolute inset-0 rounded-xl border opacity-30 animate-pulse pointer-events-none"
                             style={{
                                 borderColor: '#D97757',
                                 borderRadius: '0.75rem'
                             }}></div>
                    )}
                </div>

                {/* 错误信息 - Lovpen 设计系统 */}
                {error && (
                    <div className="flex items-center space-x-1 text-sm animate-in slide-in-from-left-2 duration-200"
                         style={{
                             color: '#CC785C',
                             fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif'
                         }}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    };

ProfessionalInput.displayName = "ProfessionalInput";