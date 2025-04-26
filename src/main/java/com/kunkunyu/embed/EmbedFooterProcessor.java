package com.kunkunyu.embed;

import org.springframework.stereotype.Component;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IModelFactory;
import org.thymeleaf.model.IProcessableElementTag;
import org.thymeleaf.processor.element.IElementTagStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.theme.dialect.TemplateFooterProcessor;

@Component
public class EmbedFooterProcessor implements TemplateFooterProcessor {

    @Override
    public Mono<Void> process(ITemplateContext context,
        IProcessableElementTag iProcessableElementTag,
        IElementTagStructureHandler structureHandler, IModel model) {
        return Mono.just(this.html()).doOnNext((html) -> {
            IModelFactory modelFactory = context.getModelFactory();
            model.add(modelFactory.createText(html));
        }).then();
    }

    private String html() {
        return "<script src=\"/plugins/plugin-thyuu-embed/assets/static/livephotoskit.js?version=1.5.8\"></script>";
    }


}
