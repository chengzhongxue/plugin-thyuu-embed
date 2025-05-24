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
                  function addLoadedClassToParents(parentSelector, childSelector, loadedClass) {
                       var parentElements = document.querySelectorAll(parentSelector);
                        parentElements.forEach(function (parentElement) {
                          var childElement = parentElement.querySelector(childSelector);
                          if (!childElement) {
                            return;
                          }
                          if (childElement) {
                            childElement.addEventListener('load', function () {
                              parentElement.classList.add(loadedClass);
                            });
                          }
                        });
                  }

                  document.addEventListener("DOMContentLoaded", () => {
                      addLoadedClassToParents('thyuu-embed', 'iframe', 'loaded');
                  }, {
                      once: true
                  });
            
                  document.addEventListener("pjax:success", () => {
                      addLoadedClassToParents('thyuu-embed', 'iframe', 'loaded');
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
