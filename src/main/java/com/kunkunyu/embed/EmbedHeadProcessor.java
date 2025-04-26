package com.kunkunyu.embed;

import com.kunkunyu.embed.service.SettingConfig;
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
public class EmbedHeadProcessor implements TemplateHeadProcessor {

    private final PropertyPlaceholderHelper
        PROPERTY_PLACEHOLDER_HELPER = new PropertyPlaceholderHelper("${", "}");
    private final PluginContext pluginContext;
    private final SettingConfig settingConfig;

    public Mono<Void> process(ITemplateContext context, IModel model, IElementModelStructureHandler structureHandler) {
        return Mono.just(this.html()).doOnNext((html) -> {
            IModelFactory modelFactory = context.getModelFactory();
            model.add(modelFactory.createText(html));
        }).then();
    }

    private String html() {
        var basicConfig = settingConfig.getBasicConfig().blockOptional().orElseThrow();

        String html = "<script src=\"${pluginStaticPath}/thyuu-embed.iife.js?version=${version}\"></script>\n";

        boolean staticEnable = basicConfig.isStaticEnable();
        System.out.println(staticEnable);
        if (staticEnable) {
            html += """
                <script>
                  function addLoadedClassToParents(parentSelector, childSelector, loadedClass) {
                      document.addEventListener('DOMContentLoaded', function () {
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
                      });
                  }
                  addLoadedClassToParents('thyuu-embed', 'iframe', 'loaded');
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
