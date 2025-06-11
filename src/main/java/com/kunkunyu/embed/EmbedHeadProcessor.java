package com.kunkunyu.embed;

import com.google.common.base.Throwables;
import com.kunkunyu.embed.service.SettingConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.PropertyPlaceholderHelper;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IModelFactory;
import org.thymeleaf.processor.element.IElementModelStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.PluginContext;
import run.halo.app.theme.dialect.TemplateHeadProcessor;
import java.util.Properties;

@Component
@Slf4j
public class EmbedHeadProcessor implements TemplateHeadProcessor {

    private final PropertyPlaceholderHelper
        PROPERTY_PLACEHOLDER_HELPER = new PropertyPlaceholderHelper("${", "}");
    private final PluginContext pluginContext;
    private final SettingConfig settingConfig;

    public Mono<Void> process(ITemplateContext context, IModel model, IElementModelStructureHandler structureHandler) {

        return settingConfig.getBasicConfig()
            .doOnNext(basicConfig -> {
                final IModelFactory modelFactory = context.getModelFactory();
                model.add(modelFactory.createText(html(basicConfig.isStaticEnable())));
            })
            .onErrorResume(e -> {
                log.error("EmbedHeadProcessor process failed", Throwables.getRootCause(e));
                return Mono.empty();
            })
            .then();
    }

    private String html(boolean staticEnable) {
        String html = "<script src=\"${pluginStaticPath}/thyuu-embed.iife.js?version=${version}\"></script>\n";

        if (staticEnable) {
            html += """
                <script>
                  // 加载提示
                  function THYUUloader(parent, loadingText = '加载中', errorText = '加载失败，点击重试') {
                    const loader = document.createElement('thyuu-loaed');
                    loader.textContent = loadingText;
                    parent.appendChild(loader);
                    return {
                        complete: () => {
                            loader.classList.add('loaded');
                            setTimeout(() => {
                                loader.remove();
                            }, 1000);
                        },
                        error: (retryCallback) => {
                            loader.textContent = errorText;
                            loader.classList.add('error');
                            loader.style.cursor = 'pointer';
                            loader.addEventListener('click', () => {
                                loader.textContent = loadingText;
                                loader.classList.remove('error');
                                if (typeof retryCallback === 'function') {
                                    retryCallback();
                                }
                            }, { once: true });
                        }
                    };
                  }
                  // 嵌入懒加载动画
                  function THYUUEmbedLoad(parentSelector, childSelector, loadedClass) {
                    document.querySelectorAll(parentSelector).forEach(parent => {
                        const child = parent.querySelector(childSelector);
                        if (!child) return;
                        const loader = THYUUloader(parent, '媒体加载中', '媒体加载失败，点击重试');
                        const loadHandler = () => {
                            parent.classList.add(loadedClass);
                            loader.complete();
                            child.removeEventListener('load', loadHandler);
                            child.removeEventListener('error', errorHandler);
                        };
                        const errorHandler = () => {
                            loader.error(() => {
                                child.addEventListener('load', loadHandler);
                                child.addEventListener('error', errorHandler);
                                if (child.tagName === 'IMG' || child.tagName === 'IFRAME') {
                                    child.src += '';
                                }
                            });
                        };
                        if (child.complete && child.tagName === 'IMG') {
                            loadHandler();
                            return;
                        }
                        child.addEventListener('load', loadHandler);
                        child.addEventListener('error', errorHandler);
                    });
                  }

                  document.addEventListener("DOMContentLoaded", () => {
                      THYUUEmbedLoad('thyuu-embed', 'iframe', 'loaded');
                  }, {
                      once: true
                  });
            
                  document.addEventListener("pjax:success", () => {
                      THYUUEmbedLoad('thyuu-embed', 'iframe', 'loaded');
                  });
             
                </script>
                <link rel="stylesheet" href="${pluginStaticPath}/thyuu-embed.css?version=${version}" />
            </div>
            """;
        }

        Properties properties = new Properties();
        properties.setProperty("version", pluginContext.getVersion());
        properties.setProperty("pluginStaticPath", "/plugins/plugin-thyuu-embed/assets/static");
        return this.PROPERTY_PLACEHOLDER_HELPER.replacePlaceholders(html, properties);
    }

    public EmbedHeadProcessor(PluginContext pluginContext, SettingConfig settingConfig) {
        this.pluginContext = pluginContext;
        this.settingConfig = settingConfig;
    }
}
