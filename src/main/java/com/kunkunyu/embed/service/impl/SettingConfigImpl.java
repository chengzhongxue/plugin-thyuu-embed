package com.kunkunyu.embed.service.impl;

import com.kunkunyu.embed.service.SettingConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.ReactiveSettingFetcher;


@Component
@RequiredArgsConstructor
public class SettingConfigImpl implements SettingConfig {

    private final ReactiveSettingFetcher settingFetcher;

    @Override
    public Mono<BasicConfig> getBasicConfig() {
        return settingFetcher.fetch(BasicConfig.GROUP, BasicConfig.class)
            .defaultIfEmpty(new BasicConfig());
    }
}
